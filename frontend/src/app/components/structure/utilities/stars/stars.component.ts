import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
})
export class StarsComponent {
  @Input() value = 0;
  @Input() interactive = false;
  @Input() size = 16;
  @Output() rated = new EventEmitter<number>();

  readonly scale = [1, 2, 3, 4, 5];
  hovered: number | null = null;

  // Porcentaje relleno de cada estrella, para medias como 4,3
  fill(star: number): number {
    const value = this.hovered ?? this.value;
    return Math.max(0, Math.min(1, value - star + 1)) * 100;
  }
}
