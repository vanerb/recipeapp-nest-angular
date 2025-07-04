import {Component} from '@angular/core';
import {Login} from '../../../../interfaces/auth';
import {AuthService} from '../../../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UtilitiesService} from "../../../../services/utilities.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form: FormGroup

  constructor(private readonly authService: AuthService, private fb: FormBuilder, private router: Router, private readonly utilitiesService: UtilitiesService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  async login() {
    const command: Login = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value
    }

    if (this.authService.isAuthenticated()) {
      await this.authService.logout()
    }

    this.authService.login(command).subscribe({
      next: async (res) => {
        if (res.access_token) {
          this.authService.setToken(res.access_token)
          await this.router.navigate(['/']);

          await this.utilitiesService.sleep(0)

          window.location.reload()
        }

      },
      error: (error) => {
        this.authService.removeToken()
      }
    })
  }
}
