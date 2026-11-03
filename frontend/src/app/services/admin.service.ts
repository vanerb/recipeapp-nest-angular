import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminComment, AdminStats, AdminUser } from '../interfaces/admin';
import { UserRole } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  constructor(private readonly http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/stats`);
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/users`);
  }

  updateUser(
    id: string,
    changes: { role?: UserRole; isBlocked?: boolean },
  ): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${this.baseUrl}/users/${id}`, changes);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  getComments(): Observable<AdminComment[]> {
    return this.http.get<AdminComment[]>(`${this.baseUrl}/comments`);
  }
}
