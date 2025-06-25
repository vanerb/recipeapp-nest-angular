import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../../../interfaces/recipes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input() data: Recipe | null = null

  constructor(private readonly router: Router) {

  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-image.jpg';
  }

  async viewDetails(item: Recipe | null) {
    if (item !== null)
      this.router.navigate(['/recipe/' + item.id]);

  }
}
