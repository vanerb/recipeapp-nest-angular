import { Component } from '@angular/core';
import { Login } from '../../../../interfaces/auth';
import { AuthService } from '../../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form: FormGroup

  constructor(private readonly authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }



  login() {
    const command: Login = {
      email: this.form.get('email')?.value,
      password:  this.form.get('password')?.value
    }

    this.authService.login(command)
  }
}
