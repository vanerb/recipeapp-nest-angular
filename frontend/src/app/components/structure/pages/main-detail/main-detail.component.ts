import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { Recipe, RecipeComment } from '../../../../interfaces/recipes';
import { AuthService } from '../../../../services/auth.service';
import { errorMessage } from '../../../../services/error-message';
import { ModalService } from '../../../../services/modal.service';
import { RecipesService } from '../../../../services/recipes.service';
import { ToastService } from '../../../../services/toast.service';
import { DeleteModalComponent } from '../../utilities/delete-modal/delete-modal.component';
import { PostFormModalComponent } from '../feed/post-form-modal/post-form-modal.component';

@Component({
  selector: 'app-main-detail',
  templateUrl: './main-detail.component.html',
})
export class MainDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe | null = null;
  comments: RecipeComment[] = [];
  myRating: number | null = null;
  selectedImage = 0;
  loading = true;
  notFound = false;
  failed = false;
  sending = false;

  commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(1000)],
  });

  private subscription?: Subscription;

  constructor(
    readonly authService: AuthService,
    private readonly recipesService: RecipesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly modalService: ModalService,
    private readonly toast: ToastService,
    private readonly title: Title,
  ) {}

  ngOnInit() {
    this.subscription = this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.notFound = false;
          this.failed = false;
          this.selectedImage = 0;
        }),
        switchMap((params) => {
          const id = params.get('id') ?? '';
          return forkJoin({
            recipe: this.recipesService.get(id),
            comments: this.recipesService.getComments(id),
          });
        }),
      )
      .subscribe({
        next: ({ recipe, comments }) => {
          this.recipe = recipe;
          this.comments = comments;
          this.loading = false;
          this.title.setTitle(`${recipe.title} · Recetas Creativas`);
          this.loadMyRating(recipe.id);
        },
        error: (error: HttpErrorResponse) => {
          this.notFound = error.status === 404;
          this.failed = !this.notFound;
          this.loading = false;
        },
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadMyRating(id: string) {
    this.myRating = null;
    if (this.authService.isAuthenticated()) {
      this.recipesService.getRating(id).subscribe((summary) => {
        this.myRating = summary.myRating;
      });
    }
  }

  get isOwner(): boolean {
    return this.authService.user?.id === this.recipe?.user.id;
  }

  get canManage(): boolean {
    return this.isOwner || this.authService.isAdmin();
  }

  canDelete(comment: RecipeComment): boolean {
    return this.canManage || this.authService.user?.id === comment.user.id;
  }

  rate(value: number) {
    this.recipesService.rate(this.recipe!.id, value).subscribe({
      next: (summary) => {
        this.myRating = summary.myRating;
        this.recipe!.averageRating = summary.averageRating;
        this.recipe!.ratingsCount = summary.ratingsCount;
        this.toast.show('¡Gracias por tu valoración!');
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }

  sendComment() {
    const text = this.commentControl.value.trim();
    if (!text || this.sending) {
      return;
    }
    this.sending = true;
    this.recipesService.addComment(this.recipe!.id, text).subscribe({
      next: (comment) => {
        this.comments = [comment, ...this.comments];
        this.commentControl.reset();
        this.sending = false;
      },
      error: (error) => {
        this.toast.error(errorMessage(error));
        this.sending = false;
      },
    });
  }

  async removeComment(comment: RecipeComment) {
    const confirmed = await this.modalService.open(DeleteModalComponent, {
      title: '¿Eliminar el comentario?',
    });
    if (!confirmed) {
      return;
    }
    this.recipesService.deleteComment(comment.id).subscribe({
      next: () => {
        this.comments = this.comments.filter((item) => item.id !== comment.id);
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }

  async removeRecipe() {
    const confirmed = await this.modalService.open(DeleteModalComponent, {
      title: '¿Eliminar esta receta?',
      message: 'También se borrarán sus comentarios, valoraciones y las publicaciones que enlazan a ella.',
    });
    if (!confirmed) {
      return;
    }
    this.recipesService.delete(this.recipe!.id).subscribe({
      next: () => {
        this.toast.show('Receta eliminada');
        this.router.navigate([this.isOwner ? '/my-panel' : '/recipes']);
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }

  async cooked() {
    if (this.authService.isAuthenticated()) {
      await this.sharePost();
      return;
    }
    await this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/recipe/' + this.recipe!.id },
    });
  }

  async sharePost() {
    const post = await this.modalService.open(PostFormModalComponent, {
      fixedRecipe: { id: this.recipe!.id, title: this.recipe!.title },
    });
    if (post) {
      this.toast.show('Publicación compartida en la comunidad');
    }
  }
}
