import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Category } from '../../../../interfaces/categories';
import { Recipe } from '../../../../interfaces/recipes';
import { AuthService } from '../../../../services/auth.service';
import { CategoriesService } from '../../../../services/categories.service';
import { errorMessage } from '../../../../services/error-message';
import { ModalService } from '../../../../services/modal.service';
import { RecipesService } from '../../../../services/recipes.service';
import { ToastService } from '../../../../services/toast.service';
import { DeleteModalComponent } from '../../utilities/delete-modal/delete-modal.component';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
})
export class ManagementComponent implements OnInit {
  tab: 'recipes' | 'categories' = 'recipes';
  recipes: Recipe[] = [];
  categories: Category[] = [];
  loading = true;

  newCategory = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(40)],
  });
  editingId: string | null = null;
  editingName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(40)],
  });

  constructor(
    readonly authService: AuthService,
    private readonly recipesService: RecipesService,
    private readonly categoriesService: CategoriesService,
    private readonly modalService: ModalService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit() {
    const id = this.authService.user!.id;
    this.recipesService.getByUserId(id).subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
      },
      error: (error) => {
        this.toast.error(errorMessage(error));
        this.loading = false;
      },
    });
    this.categoriesService.getByUserId(id).subscribe((categories) => {
      this.categories = categories;
    });
  }

  async removeRecipe(recipe: Recipe) {
    const confirmed = await this.modalService.open(DeleteModalComponent, {
      title: `¿Eliminar «${recipe.title}»?`,
      message: 'También se borrarán sus comentarios, valoraciones y las publicaciones que enlazan a ella.',
    });
    if (!confirmed) {
      return;
    }
    this.recipesService.delete(recipe.id).subscribe({
      next: () => {
        this.recipes = this.recipes.filter((item) => item.id !== recipe.id);
        this.toast.show('Receta eliminada');
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }

  addCategory() {
    const name = this.newCategory.value.trim();
    if (!name) {
      return;
    }
    this.categoriesService.create(name).subscribe({
      next: (category) => {
        this.categories = [...this.categories, category];
        this.newCategory.reset();
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }

  startEditing(category: Category) {
    this.editingId = category.id;
    this.editingName.setValue(category.name);
  }

  saveCategory(category: Category) {
    const name = this.editingName.value.trim();
    if (!name) {
      return;
    }
    this.categoriesService.update(category.id, name).subscribe({
      next: () => {
        category.name = name;
        this.editingId = null;
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }

  async removeCategory(category: Category) {
    const confirmed = await this.modalService.open(DeleteModalComponent, {
      title: `¿Eliminar «${category.name}»?`,
      message: 'Las recetas que la usan se quedarán sin categoría.',
    });
    if (!confirmed) {
      return;
    }
    this.categoriesService.delete(category.id).subscribe({
      next: () => {
        this.categories = this.categories.filter((item) => item.id !== category.id);
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }
}
