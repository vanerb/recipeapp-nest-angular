import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {

  isLogedIn: boolean = false;
  constructor(private readonly router: Router, private readonly authService: AuthService) {
  }

  async login() {
    await this.router.navigate(['login']);
  }

  async register(){
    await this.router.navigate(['register']);
  }

  ngOnInit() {
    this.isLogedIn = this.authService.isAuthenticated()
  }
}
