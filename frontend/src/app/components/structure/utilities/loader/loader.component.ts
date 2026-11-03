import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="flex items-center justify-center gap-3 py-16 text-muted" role="status">
      <span class="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-herb"></span>
      <span>{{ text }}</span>
    </div>
  `,
})
export class LoaderComponent {
  @Input() text = 'Cargando…';
}
