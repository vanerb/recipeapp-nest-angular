import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';
import {UsersService} from '../../../../services/users.service';
import {CreateUser} from '../../../../interfaces/users';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  form: FormGroup

  constructor(private readonly userService: UsersService, private fb: FormBuilder, private router: Router, private readonly authService: AuthService) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      subname: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }


  async register() {
    console.log(this.form.value)
    if (this.form.get('password')?.value !== this.form.get('repeatPassword')?.value) {
      return
    }
    const command: CreateUser = {
      name: this.form.get('name')?.value + " " + this.form.get('subname')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      token: ""
    }
    if (this.authService.isAuthenticated()) {
      await this.authService.logout()
    }
    this.userService.create(command).subscribe({
      next: async (user) => {

        await this.router.navigate(['/login'])
      },
      error: (err) => {

      }
    });

  }
}
