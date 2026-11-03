import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { AdminComment, AdminStats, AdminUser } from '../../../../interfaces/admin';
import { Category } from '../../../../interfaces/categories';
import { Post } from '../../../../interfaces/posts';
import { Recipe } from '../../../../interfaces/recipes';
import { AdminService } from '../../../../services/admin.service';
import { AuthService } from '../../../../services/auth.service';
import { CategoriesService } from '../../../../services/categories.service';
import { errorMessage } from '../../../../services/error-message';
import { ModalService } from '../../../../services/modal.service';
import { PostsService } from '../../../../services/posts.service';
import { RecipesService } from '../../../../services/recipes.service';
import { ToastService } from '../../../../services/toast.service';
import { DeleteModalComponent } from '../../utilities/delete-modal/delete-modal.component';

type AdminTab = 'users' | 'recipes' | 'posts' | 'comments' | 'categories';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  tab: AdminTab = 'users';
  query = '';
  loading = true;
  failed = false;

  stats: AdminStats | null = null;
  users: AdminUser[] = [];
  recipes: Recipe[] = [];
  posts: Post[] = [];
  comments: AdminComment[] = [];
  categories: Category[] = [];

  editingId: string | null = null;
  editingName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(40)],
  });

  constructor(
    readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly recipesService: RecipesService,
    private readonly postsService: PostsService,
    private readonly categoriesService: CategoriesService,
    private readonly modalService: ModalService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit() {
    this.load();
  }

  // Tras cada acción se recarga todo: borrar una cuenta o receta afecta a varias listas
  private load() {
    forkJoin({
      stats: this.adminService.getStats(),
      users: this.adminService.getUsers(),
      recipes: this.recipesService.getAll(),
      posts: this.postsService.getAll(),
      comments: this.adminService.getComments(),
      categories: this.categoriesService.getAll(),
    }).subscribe({
      next: (data) => {
        Object.assign(this, data);
        this.loading = false;
      },
      error: (error) => {
        this.failed = true;
        this.loading = false;
        this.toast.error(errorMessage(error));
      },
    });
  }

  private run(action: Observable<unknown>, message: string) {
    action.subscribe({
      next: () => {
        this.toast.show(message);
        this.load();
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }

  private async confirmed(title: string, message: string, action = 'Eliminar') {
    return this.modalService.open(DeleteModalComponent, { title, message, action });
  }

  get tabs(): { key: AdminTab; label: string; count: number }[] {
    return [
      { key: 'users', label: 'Usuarios', count: this.users.length },
      { key: 'recipes', label: 'Recetas', count: this.recipes.length },
      { key: 'posts', label: 'Publicaciones', count: this.posts.length },
      { key: 'comments', label: 'Comentarios', count: this.comments.length },
      { key: 'categories', label: 'Categorías', count: this.categories.length },
    ];
  }

  selectTab(tab: AdminTab) {
    this.tab = tab;
    this.query = '';
    this.editingId = null;
  }

  private matches(...values: (string | null | undefined)[]): boolean {
    const term = this.query.trim().toLowerCase();
    return !term || values.some((value) => value?.toLowerCase().includes(term));
  }

  get filteredUsers() {
    return this.users.filter((user) => this.matches(user.name, user.email));
  }

  get filteredRecipes() {
    return this.recipes.filter((recipe) => this.matches(recipe.title, recipe.user.name));
  }

  get filteredPosts() {
    return this.posts.filter((post) =>
      this.matches(post.caption, post.user.name, post.recipe.title),
    );
  }

  get filteredComments() {
    return this.comments.filter((comment) =>
      this.matches(comment.text, comment.user.name, comment.recipe.title),
    );
  }

  get filteredCategories() {
    return this.categories.filter((category) => this.matches(category.name));
  }

  isMe(user: AdminUser): boolean {
    return user.id === this.authService.user?.id;
  }

  async toggleBlock(user: AdminUser) {
    const blocking = !user.isBlocked;
    const ok = await this.confirmed(
      blocking ? `¿Bloquear a ${user.name}?` : `¿Desbloquear a ${user.name}?`,
      blocking
        ? 'No podrá entrar ni participar. Su contenido seguirá visible hasta que lo elimines.'
        : 'Podrá volver a entrar y participar.',
      blocking ? 'Bloquear' : 'Desbloquear',
    );
    if (ok) {
      this.run(
        this.adminService.updateUser(user.id, { isBlocked: blocking }),
        blocking ? 'Cuenta bloqueada' : 'Cuenta desbloqueada',
      );
    }
  }

  async toggleAdmin(user: AdminUser) {
    const promoting = user.role !== 'admin';
    const ok = await this.confirmed(
      promoting ? `¿Dar acceso de administración a ${user.name}?` : `¿Quitar la administración a ${user.name}?`,
      promoting
        ? 'Podrá editar y eliminar cualquier contenido y gestionar todas las cuentas, incluida la tuya.'
        : 'Volverá a ser una cuenta normal.',
      promoting ? 'Dar acceso' : 'Quitar acceso',
    );
    if (ok) {
      this.run(
        this.adminService.updateUser(user.id, { role: promoting ? 'admin' : 'user' }),
        promoting ? 'Ahora tiene acceso de administración' : 'Acceso de administración retirado',
      );
    }
  }

  async removeUser(user: AdminUser) {
    const ok = await this.confirmed(
      `¿Eliminar la cuenta de ${user.name}?`,
      `Se borrarán también sus ${user.recipesCount} recetas, sus ${user.postsCount} publicaciones, sus comentarios y sus valoraciones. No se puede deshacer.`,
    );
    if (ok) {
      this.run(this.adminService.deleteUser(user.id), 'Cuenta eliminada');
    }
  }

  async removeRecipe(recipe: Recipe) {
    const ok = await this.confirmed(
      `¿Eliminar «${recipe.title}»?`,
      'También se borrarán sus comentarios, valoraciones y las publicaciones que enlazan a ella.',
    );
    if (ok) {
      this.run(this.recipesService.delete(recipe.id), 'Receta eliminada');
    }
  }

  async removePost(post: Post) {
    const ok = await this.confirmed(
      '¿Eliminar la publicación?',
      `Es de ${post.user.name}. No se puede deshacer.`,
    );
    if (ok) {
      this.run(this.postsService.delete(post.id), 'Publicación eliminada');
    }
  }

  async removeComment(comment: AdminComment) {
    const ok = await this.confirmed(
      '¿Eliminar el comentario?',
      `Es de ${comment.user.name}. No se puede deshacer.`,
    );
    if (ok) {
      this.run(this.recipesService.deleteComment(comment.id), 'Comentario eliminado');
    }
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
    this.editingId = null;
    this.run(this.categoriesService.update(category.id, name), 'Categoría actualizada');
  }

  async removeCategory(category: Category) {
    const ok = await this.confirmed(
      `¿Eliminar «${category.name}»?`,
      'Las recetas que la usan se quedarán sin categoría.',
    );
    if (ok) {
      this.run(this.categoriesService.delete(category.id), 'Categoría eliminada');
    }
  }
}
