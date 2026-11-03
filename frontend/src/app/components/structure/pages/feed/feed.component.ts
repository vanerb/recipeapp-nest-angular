import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../../../interfaces/posts';
import { AuthService } from '../../../../services/auth.service';
import { errorMessage } from '../../../../services/error-message';
import { ModalService } from '../../../../services/modal.service';
import { PostsService } from '../../../../services/posts.service';
import { ToastService } from '../../../../services/toast.service';
import { DeleteModalComponent } from '../../utilities/delete-modal/delete-modal.component';
import { PostFormModalComponent } from './post-form-modal/post-form-modal.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  failed = false;

  constructor(
    private readonly postsService: PostsService,
    private readonly authService: AuthService,
    private readonly modalService: ModalService,
    private readonly router: Router,
    private readonly toast: ToastService,
  ) {}

  ngOnInit() {
    this.postsService.getAll().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: () => {
        this.failed = true;
        this.loading = false;
      },
    });
  }

  async newPost() {
    if (!this.authService.isAuthenticated()) {
      await this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/community' },
      });
      return;
    }
    const post: Post | undefined = await this.modalService.open(PostFormModalComponent);
    if (post) {
      this.posts = [post, ...this.posts];
      this.toast.show('Publicación compartida');
    }
  }

  async remove(post: Post) {
    const confirmed = await this.modalService.open(DeleteModalComponent, {
      title: '¿Eliminar la publicación?',
    });
    if (!confirmed) {
      return;
    }
    this.postsService.delete(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter((item) => item.id !== post.id);
      },
      error: (error) => this.toast.error(errorMessage(error)),
    });
  }
}
