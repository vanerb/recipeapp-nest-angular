import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Category } from '../../../../interfaces/categories';
import { RecipeImage } from '../../../../interfaces/recipes';
import { AuthService } from '../../../../services/auth.service';
import { CategoriesService } from '../../../../services/categories.service';
import { errorMessage } from '../../../../services/error-message';
import { RecipesService } from '../../../../services/recipes.service';
import { ToastService } from '../../../../services/toast.service';

type ListName = 'ingredients' | 'preparations' | 'hashtags';

const MAX_IMAGES = 10;

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
})
export class RecipeFormComponent implements OnInit, OnDestroy {
  recipeId: string | null = null;
  form: FormGroup;
  categories: Category[] = [];

  ingredients: string[] = [];
  preparations: string[] = [];
  hashtags: string[] = [];

  existingImages: RecipeImage[] = [];
  newImages: { file: File; preview: string }[] = [];

  loading = false;
  saving = false;
  submitted = false;
  error = '';
  imageError = '';
  creatingCategory = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly recipesService: RecipesService,
    private readonly categoriesService: CategoriesService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toast: ToastService,
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      categoryId: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.loading = true;
    try {
      this.categories = await firstValueFrom(this.categoriesService.getAll());
      if (this.recipeId) {
        await this.loadRecipe(this.recipeId);
      }
    } catch (error) {
      this.error = errorMessage(error);
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.newImages.forEach((image) => URL.revokeObjectURL(image.preview));
  }

  private async loadRecipe(id: string) {
    const recipe = await firstValueFrom(this.recipesService.get(id));
    if (recipe.user.id !== this.authService.user?.id && !this.authService.isAdmin()) {
      this.toast.error('Solo puedes editar tus propias recetas');
      await this.router.navigate(['/recipe', id]);
      return;
    }
    this.form.patchValue({
      title: recipe.title,
      description: recipe.description,
      categoryId: recipe.category?.id ?? '',
    });
    this.ingredients = recipe.ingredients.map((item) => item.ingredient);
    this.preparations = recipe.preparations.map((item) => item.preparation);
    this.hashtags = recipe.hashtags.map((item) => item.hashtag);
    this.existingImages = recipe.images;
  }

  add(list: ListName, input: HTMLInputElement | HTMLTextAreaElement) {
    let value = input.value.trim();
    if (list === 'hashtags') {
      value = value.replace(/^#+/, '').toLowerCase();
    }
    if (value && !(list === 'hashtags' && this.hashtags.includes(value))) {
      this[list] = [...this[list], value];
    }
    input.value = '';
    input.focus();
  }

  remove(list: ListName, index: number) {
    this[list] = this[list].filter((_, position) => position !== index);
  }

  move(list: 'ingredients' | 'preparations', index: number, offset: number) {
    const items = [...this[list]];
    [items[index], items[index + offset]] = [items[index + offset], items[index]];
    this[list] = items;
  }

  get imageCount(): number {
    return this.existingImages.length + this.newImages.length;
  }

  onImages(event: Event) {
    const input = event.target as HTMLInputElement;
    this.imageError = '';
    for (const file of Array.from(input.files ?? [])) {
      if (this.imageCount >= MAX_IMAGES) {
        this.imageError = `Puedes subir hasta ${MAX_IMAGES} imágenes.`;
        break;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        this.imageError = 'Solo se admiten imágenes JPG, PNG, WebP o GIF.';
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.imageError = `«${file.name}» supera los 5 MB.`;
        continue;
      }
      this.newImages.push({ file, preview: URL.createObjectURL(file) });
    }
    input.value = '';
  }

  removeExistingImage(image: RecipeImage) {
    this.existingImages = this.existingImages.filter((item) => item.id !== image.id);
  }

  removeNewImage(index: number) {
    URL.revokeObjectURL(this.newImages[index].preview);
    this.newImages.splice(index, 1);
  }

  async createCategory(input: HTMLInputElement) {
    const name = input.value.trim();
    if (!name) {
      return;
    }
    try {
      const category = await firstValueFrom(this.categoriesService.create(name));
      this.categories = [...this.categories, category].sort((a, b) =>
        a.name.localeCompare(b.name, 'es'),
      );
      this.form.patchValue({ categoryId: category.id });
      this.creatingCategory = false;
    } catch (error) {
      this.toast.error(errorMessage(error));
    }
  }

  async save() {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (
      this.form.invalid ||
      this.ingredients.length === 0 ||
      this.preparations.length === 0 ||
      this.imageCount === 0
    ) {
      this.error = 'Revisa los campos marcados antes de guardar.';
      return;
    }

    const value = this.form.value;
    const data = new FormData();
    data.append('title', value.title.trim());
    data.append('description', value.description.trim());
    data.append('categoryId', value.categoryId);
    data.append('ingredients', JSON.stringify(this.ingredients));
    data.append('preparations', JSON.stringify(this.preparations));
    data.append('hashtags', JSON.stringify(this.hashtags));
    this.newImages.forEach((image) => data.append('images', image.file));

    this.saving = true;
    this.error = '';
    try {
      let id = this.recipeId;
      if (id) {
        data.append('keepImageIds', JSON.stringify(this.existingImages.map((image) => image.id)));
        await firstValueFrom(this.recipesService.update(data, id));
      } else {
        id = (await firstValueFrom(this.recipesService.create(data))).id;
      }
      this.toast.show(this.recipeId ? 'Receta actualizada' : '¡Receta publicada!');
      await this.router.navigate(['/recipe', id]);
    } catch (error) {
      this.error = errorMessage(error);
    } finally {
      this.saving = false;
    }
  }
}
