import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateUser, CurrentUser, Login } from '../interfaces/users';
import { safeStorage } from './safe-storage';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private readonly userSubject = new BehaviorSubject<CurrentUser | null>(null);
  readonly user$ = this.userSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  get user(): CurrentUser | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return safeStorage.get(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'admin';
  }

  // Recupera la sesión guardada antes de pintar la primera ruta
  async restoreSession(): Promise<void> {
    if (!this.getToken()) {
      return;
    }
    try {
      await this.loadUser();
    } catch {
      this.clearSession();
    }
  }

  private loadUser(): Promise<CurrentUser> {
    return firstValueFrom(
      this.http
        .get<CurrentUser>(`${this.baseUrl}/me`)
        .pipe(tap((user) => this.userSubject.next(user))),
    );
  }

  async login(command: Login): Promise<CurrentUser> {
    const { access_token } = await firstValueFrom(
      this.http.post<{ access_token: string }>(
        `${this.baseUrl}/login`,
        command,
      ),
    );
    safeStorage.set(TOKEN_KEY, access_token);
    return this.loadUser();
  }

  async register(command: CreateUser): Promise<CurrentUser> {
    await firstValueFrom(this.http.post(`${this.baseUrl}/create`, command));
    return this.login({ email: command.email, password: command.password });
  }

  updateProfile(command: FormData): Observable<CurrentUser> {
    return this.http
      .patch<CurrentUser>(`${this.baseUrl}/me`, command)
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  async deleteAccount(): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.baseUrl}/me`));
    await this.logout();
  }

  clearSession() {
    safeStorage.remove(TOKEN_KEY);
    this.userSubject.next(null);
  }

  async logout() {
    this.clearSession();
    await this.router.navigate(['/']);
  }
}
