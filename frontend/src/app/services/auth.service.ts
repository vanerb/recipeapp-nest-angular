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
    this.http.post<any>("http://localhost:3002/users/login", command).subscribe({
      next: async (res) => {
        if (res.access_token) {
          this.setToken(res.access_token)
          this.router.navigate(['/']);

          await this.sleep(0)

          window.location.reload()

        }

      },
      error: (error) => {
        this.removeToken()
      }
    }).unsubscribe()


    

  }


  logout() {
    this.removeToken()
    this.router.navigate(['/login']);
    window.location.reload()
  }

  sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
