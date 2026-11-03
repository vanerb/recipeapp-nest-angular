import { Component, ElementRef, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // En el propio elemento: sticky necesita un contenedor con recorrido, y este es block
  host: { class: 'sticky top-0 z-30 block' },
})
export class HeaderComponent {
  mobileOpen = false;
  userMenuOpen = false;

  readonly links = [
    { label: 'Inicio', path: '/', exact: true },
    { label: 'Recetas', path: '/recipes', exact: false },
    { label: 'Comunidad', path: '/community', exact: false },
  ];

  constructor(
    readonly authService: AuthService,
    router: Router,
    private readonly host: ElementRef<HTMLElement>,
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenus());
  }

  closeMenus() {
    this.mobileOpen = false;
    this.userMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.closeMenus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenus();
  }

  async logout() {
    this.closeMenus();
    await this.authService.logout();
  }
}
