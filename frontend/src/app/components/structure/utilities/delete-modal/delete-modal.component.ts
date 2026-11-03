import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  template: `
    <h2 class="text-2xl">{{ title }}</h2>
    <p class="mt-2 text-muted">{{ message }}</p>
    <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <button type="button" class="btn-outline" (click)="close()">Cancelar</button>
      <button type="button" class="btn-danger" (click)="confirm(true)">{{ action }}</button>
    </div>
  `,
})
export class DeleteModalComponent {
  @Input() title = '¿Seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() action = 'Eliminar';
  confirm!: (result?: unknown) => void;
  close!: () => void;
}
