import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient, private router: Router) { }

  setToken(token: string) {
    localStorage.setItem("auth_token", token)
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken() {
    localStorage.removeItem('auth_token')
  }


  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  login(command: Login) {
    return this.http.post<any>("http://localhost:3002/users/login", command)
  }


  async logout() {
    this.removeToken()
    await this.router.navigate(['/login']);
    window.location.reload()
  }


}
