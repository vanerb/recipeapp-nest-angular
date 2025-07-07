import {Component} from '@angular/core';
import {Route, Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {UsersService} from "../../../../services/users.service";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {

  constructor(private readonly router: Router, private readonly userService: UsersService, private readonly authService: AuthService) {
  }

  async redirect(type: string) {
    const user = await firstValueFrom(this.userService.getByToken(this.authService.getToken() ?? ''));
    switch (type) {
      case 'profile':

        await this.router.navigate(['/profile/' + user.id]);
        break

      case 'recipes':
        await this.router.navigate(['/management/' + user.id]);
        break

      case 'categories':
        await this.router.navigate(['/categories/' + user.id]);
        break
    }
  }
}
