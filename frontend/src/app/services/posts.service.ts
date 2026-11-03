import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../interfaces/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly baseUrl = `${environment.apiUrl}/posts`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  getByUserId(id: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/user/${id}`);
  }

  create(command: FormData): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, command);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
