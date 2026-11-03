import { Component, Input } from '@angular/core';
import { Recipe } from '../../../../interfaces/recipes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  host: { class: 'block min-w-0' },
})
export class CardComponent {
  @Input({ required: true }) data!: Recipe;
}
