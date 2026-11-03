import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  RatingSummary,
  Recipe,
  RecipeComment,
  RecipeFilters,
} from '../interfaces/recipes';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private readonly baseUrl = `${environment.apiUrl}/recipes`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: RecipeFilters = {}): Observable<Recipe[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value);
      }
    }
    return this.http.get<Recipe[]>(this.baseUrl, { params });
  }

  get(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.baseUrl}/${id}`);
  }

  getByUserId(id: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/user/${id}`);
  }

  create(command: FormData): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, command);
  }

  update(command: FormData, id: string): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.baseUrl}/${id}`, command);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getComments(id: string): Observable<RecipeComment[]> {
    return this.http.get<RecipeComment[]>(`${this.baseUrl}/${id}/comments`);
  }

  addComment(id: string, text: string): Observable<RecipeComment> {
    return this.http.post<RecipeComment>(`${this.baseUrl}/${id}/comments`, {
      text,
    });
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/comments/${id}`);
  }

  getRating(id: string): Observable<RatingSummary> {
    return this.http.get<RatingSummary>(`${this.baseUrl}/${id}/rating`);
  }

  rate(id: string, value: number): Observable<RatingSummary> {
    return this.http.put<RatingSummary>(`${this.baseUrl}/${id}/rating`, {
      value,
    });
  }
}
