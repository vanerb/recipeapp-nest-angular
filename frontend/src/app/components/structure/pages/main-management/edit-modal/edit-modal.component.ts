import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddIngredients } from '../../../../../interfaces/ingredients';
import { AddPreparations } from '../../../../../interfaces/preparations';
import { AddHashtags } from '../../../../../interfaces/hashtags';
import { Categories } from '../../../../../interfaces/categories';
import { RecipesService } from '../../../../../services/recipes.service';
import { ModalService } from '../../../../../services/modal.service';
import { UsersService } from '../../../../../services/users.service';
import { AuthService } from '../../../../../services/auth.service';
import { CategoriesService } from '../../../../../services/categories.service';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../../../../../interfaces/recipes';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css'
})
export class EditModalComponent {
  form: FormGroup;
  ingredients: AddIngredients[] = [];
  preparations: AddPreparations[] = [];
  hashtags: AddHashtags[] = [];
  selectedRecipeImages: File[] = [];
  categories: Categories[] = [];
  @ViewChild('hashtagInput') hashtagInput!: ElementRef<HTMLInputElement>;
  @ViewChild('preparationInput')
  preparationInput!: ElementRef<HTMLInputElement>;
  @ViewChild('ingredientsInput')
  ingredientsnInput!: ElementRef<HTMLInputElement>;

  @Input() id: string = ""
  recipe: Recipe | null = null

  constructor(
    private fb: FormBuilder,
    private readonly recipesService: RecipesService,
    private readonly modalService: ModalService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly categoryService: CategoriesService,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: [''],
      description: [''],
      userId: [''],
      category: [''],
      hashtags: this.fb.control([]),
      ingredients: this.fb.control([]),
      preparations: this.fb.control([]),
    });
  }
  ngOnDestroy(): void { }

  async ngOnInit(): Promise<void> {
    console.log(this.id)

    this.categoryService.getAll().subscribe((el) => {
      this.categories = el;
    })

    this.recipe = await this.recipesService.get(this.id)

    this.form.get('title')?.setValue(this.recipe.title)
    this.form.get('description')?.setValue(this.recipe.description)
    this.ingredients = this.recipe.ingredients
    this.preparations = this.recipe.preparations
    this.hashtags = this.recipe.hashtags
    this.form.get('category')?.setValue(this.recipe.category.id)
    this.recipe.images.map(async el => {
      const file = await this.urlToFile('http://localhost:3002' + el.url, 'imagen.jpg', 'image/jpeg');
      this.selectedRecipeImages.push(file)
    })
  }

  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

  add(type: string) {
    if (type === 'ingredients') {
      const input = this.ingredientsnInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.ingredients.push({ ingredient: valor });
      }
      input.value = '';
    } else if (type === 'preparations') {
      const input = this.preparationInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.preparations.push({ preparation: valor });
      }
      input.value = '';
    } else if (type === 'hashtags') {
      const input = this.hashtagInput.nativeElement;
      const valor = input.value.trim();
      if (valor) {
        this.hashtags.push({ hashtag: valor });
      }
      input.value = '';
    }
  }

  delete(pos: number, type: string) {
    if (type === 'ingredients') {
      this.ingredients.splice(pos, 1);

    } else if (type === 'preparations') {
      this.preparations.splice(pos, 1);

    } else if (type === 'hashtags') {
      this.hashtags.splice(pos, 1);
    }else if(type === 'images'){
      this.selectedRecipeImages.splice(pos, 1)
    }
  }

  close() {
    this.modalService.close();
  }

  async update() {
    const user = await this.userService.getByToken(
      this.authService.getToken() ?? ''
    );

    const formData = new FormData();
    const value = this.form.value;

    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('userId', user.id);
    formData.append('category', value.category);

    formData.append('hashtags', JSON.stringify(this.hashtags));
    formData.append('ingredients', JSON.stringify(this.ingredients));
    formData.append('preparations', JSON.stringify(this.preparations));

    for (const file of this.selectedRecipeImages) {
      formData.append('images', file);
    }

    this.recipesService.update(formData, this.id);
    this.modalService.close();
  }

  onFileRecipeSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const newFiles = Array.from(target.files);

      // Filtra duplicados (evita archivos con el mismo nombre que ya estén en el array)
      const uniqueNewFiles = newFiles.filter(
        (file) => !this.selectedRecipeImages.some((f) => f.name === file.name)
      );

      // Inserta las nuevas imágenes DESPUÉS de la portada (si existe)
      if (this.selectedRecipeImages.length > 0) {
        const [first, ...rest] = this.selectedRecipeImages;
        this.selectedRecipeImages = [first, ...rest, ...uniqueNewFiles];
      } else {
        this.selectedRecipeImages = [...uniqueNewFiles];
      }
    }
  }

  onFilePrincipalSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const principalFile = target.files[0];

      // Elimina si ya existía ese archivo
      this.selectedRecipeImages = this.selectedRecipeImages.filter(
        (file) => file.name !== principalFile.name
      );

      // Elimina cualquier otra imagen que esté en la posición 0 (si asumimos que la portada va ahí)
      this.selectedRecipeImages = this.selectedRecipeImages.filter(
        (file, index) => index !== 0
      );

      // Inserta la imagen principal en la primera posición
      this.selectedRecipeImages.unshift(principalFile);
    }
  }
}
