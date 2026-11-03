import { Component } from '@angular/core';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="pointer-events-none fixed inset-x-4 bottom-5 z-50 flex justify-center" aria-live="polite">
      <div
        *ngIf="toastService.toast$ | async as toast"
        class="pointer-events-auto flex max-w-md items-start gap-2.5 rounded-xl px-4 py-3 text-paper shadow-lift"
        [ngClass]="toast.type === 'error' ? 'bg-tomato' : 'bg-ink'"
      >
        <i
          class="bi mt-px"
          [ngClass]="toast.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle'"
          aria-hidden="true"
        ></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  `,
})
export class ToastComponent {
  constructor(readonly toastService: ToastService) {}
}
