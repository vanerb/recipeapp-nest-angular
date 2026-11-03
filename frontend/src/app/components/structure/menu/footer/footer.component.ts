import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="mt-20 bg-herb-dark text-paper">
      <div class="page flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="font-display text-xl">Recetas Creativas</p>
          <p class="text-paper/75">Lo que se cocina de verdad, contado por quien lo cocina.</p>
        </div>
        <nav class="flex gap-5" aria-label="Pie de página">
          <a routerLink="/recipes" class="hover:underline">Recetas</a>
          <a routerLink="/community" class="hover:underline">Comunidad</a>
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
