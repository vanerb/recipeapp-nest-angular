import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { environment } from '../environments/environment';
import { ModalComponent } from './components/structure/utilities/modal/modal.component';
import { DEMO_DB_KEY } from './demo/demo-api.interceptor';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
import { safeStorage } from './services/safe-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('modal') modal!: ModalComponent;
  readonly isDemo = environment.demo;

  constructor(
    private readonly modalService: ModalService,
    private readonly authService: AuthService,
  ) {}

  ngAfterViewInit() {
    this.modalService.register(this.modal);
  }

  resetDemo() {
    safeStorage.remove(DEMO_DB_KEY);
    this.authService.clearSession();
    window.location.reload();
  }
}
