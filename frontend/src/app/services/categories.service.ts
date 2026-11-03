import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../interfaces/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getByUserId(id: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/byUserId/${id}`);
  }

  create(name: string): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, { name });
  }

  update(id: string, name: string): Observable<Category> {
    return this.http.patch<Category>(`${this.baseUrl}/${id}`, { name });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
