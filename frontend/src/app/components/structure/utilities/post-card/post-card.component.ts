import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../../interfaces/posts';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  host: { class: 'block min-w-0' },
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() remove = new EventEmitter<Post>();

  constructor(private readonly authService: AuthService) {}

  // Sin nadie escuchando, como en la portada, el botón no haría nada
  get canRemove(): boolean {
    return (
      this.remove.observed &&
      (this.authService.isAdmin() || this.authService.user?.id === this.post.user.id)
    );
  }
}
