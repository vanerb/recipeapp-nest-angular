import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { Post } from '../../../../interfaces/posts';
import { Recipe } from '../../../../interfaces/recipes';
import { UserProfile } from '../../../../interfaces/users';
import { AuthService } from '../../../../services/auth.service';
import { errorMessage } from '../../../../services/error-message';
import { ModalService } from '../../../../services/modal.service';
import { PostsService } from '../../../../services/posts.service';
import { RecipesService } from '../../../../services/recipes.service';
import { ToastService } from '../../../../services/toast.service';
import { UsersService } from '../../../../services/users.service';
import { DeleteModalComponent } from '../../utilities/delete-modal/delete-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  recipes: Recipe[] = [];
  posts: Post[] = [];
  tab: 'recipes' | 'posts' = 'recipes';
  loading = true;
  notFound = false;
  failed = false;

  private subscription?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly recipesService: RecipesService,
    private readonly postsService: PostsService,
    private readonly modalService: ModalService,
    private readonly toast: ToastService,
    private readonly route: ActivatedRoute,
    private readonly title: Title,
  ) {}

  ngOnInit() {
    this.subscription = this.route.paramMap
      .pipe(
        tap(() => {
          this.loading = true;
          this.notFound = false;
          this.failed = false;
          this.tab = 'recipes';
        }),
        switchMap((params) => {
          const id = params.get('id') ?? '';
          return forkJoin({
            profile: this.usersService.getProfile(id),
            recipes: this.recipesService.getByUserId(id),
            posts: this.postsService.getByUserId(id),
          });
        }),
      )
      .subscribe({
        next: ({ profile, recipes, posts }) => {
          this.profile = profile;
          this.recipes = recipes;
          this.posts = posts;
          this.loading = false;
          this.title.setTitle(`${profile.name} · Recetas Creativas`);
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

  get isMine(): boolean {
    return this.authService.user?.id === this.profile?.id;
  }

  async removePost(post: Post) {
    const confirmed = await this.modalService.open(DeleteModalComponent, {
      title: '¿Eliminar la publicación?',
    });
    if (!confirmed) {
      return;
    }
    this.postsService.delete(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter((item) => item.id !== post.id);
        this.profile!.postsCount = this.posts.length;
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }
}
