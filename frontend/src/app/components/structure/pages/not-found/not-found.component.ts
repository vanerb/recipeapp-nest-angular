import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="page py-16">
      <app-empty-state
        icon="bi-signpost-split"
        title="Esta página no está en el menú"
        text="Puede que el enlace sea antiguo o que la receta ya no exista."
      >
        <a routerLink="/recipes" class="btn-primary">Ver recetas</a>
      </app-empty-state>
    </div>
  `,
})
export class NotFoundComponent {}
