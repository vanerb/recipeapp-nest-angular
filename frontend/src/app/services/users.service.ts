import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserProfile } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  getProfile(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/users/${id}`);
  }
}
