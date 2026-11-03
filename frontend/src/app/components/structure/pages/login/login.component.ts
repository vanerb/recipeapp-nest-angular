import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth.service';
import { errorMessage } from '../../../../services/error-message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly isDemo = environment.demo;
  readonly demoUsers = [
    { name: 'Marta Soler', email: 'marta@recetas.test' },
    { name: 'Diego Romero', email: 'diego@recetas.test' },
    { name: 'Administración', email: 'admin@recetas.test' },
  ];

  form: FormGroup;
  error = '';
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    await this.enter(this.form.value);
  }

  enterAs(email: string) {
    return this.enter({ email, password: 'demo' });
  }

  private async enter(command: { email: string; password: string }) {
    this.loading = true;
    this.error = '';
    try {
      await this.authService.login(command);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      await this.router.navigateByUrl(returnUrl ?? '/');
    } catch (error) {
      this.error = errorMessage(error);
    } finally {
      this.loading = false;
    }
  }
}
