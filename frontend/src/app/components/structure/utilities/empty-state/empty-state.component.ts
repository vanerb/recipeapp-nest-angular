import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="rounded-2xl border border-dashed border-ink/25 px-6 py-14 text-center">
      <i class="bi {{ icon }} text-3xl text-muted" aria-hidden="true"></i>
      <p class="mt-3 font-display text-2xl">{{ title }}</p>
      <p *ngIf="text" class="mx-auto mt-1 max-w-md text-muted">{{ text }}</p>
      <div class="mt-5 empty:hidden"><ng-content></ng-content></div>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'bi-journal-text';
  @Input() title = '';
  @Input() text = '';
}
