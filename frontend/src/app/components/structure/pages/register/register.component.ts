import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { errorMessage } from '../../../../services/error-message';
import { ToastService } from '../../../../services/toast.service';

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  return group.get('password')?.value === group.get('repeatPassword')?.value
    ? null
    : { mismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly toast: ToastService,
  ) {
    this.form = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(80)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD)]],
        repeatPassword: ['', Validators.required],
      },
      { validators: passwordsMatch },
    );
  }

  async register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    const { name, email, password } = this.form.value;
    try {
      await this.authService.register({ name: name.trim(), email, password });
      this.toast.show('Cuenta creada. ¡Ya puedes compartir tus recetas!');
      await this.router.navigate(['/']);
    } catch (error) {
      this.error = errorMessage(error);
    } finally {
      this.loading = false;
    }
  }
}
