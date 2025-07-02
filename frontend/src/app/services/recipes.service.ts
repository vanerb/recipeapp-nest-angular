import {Injectable} from '@angular/core';
import {CreateRecipe, Recipe, Recipes, UpdateRecipe} from '../interfaces/recipes';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable, take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private baseUrl = 'http://localhost:3002/recipes';

  constructor(private readonly http: HttpClient) {
  }


  async get(id: string): Promise<Recipe> {
    const recipes = await firstValueFrom(
      this.http.get<Recipe[]>(this.baseUrl + "/" + id)
    );
    return recipes[0];  // Devuelves el único elemento del array
  }

  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl);
  }

  getByUserId(id: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/user/${id}`);
  }

  getByCategoryId(id: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.baseUrl}/category/${id}`);
  }

  create(command: FormData): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, command)
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }

  update(command: FormData, id: string): Observable<Recipe> {
    return this.http.patch<Recipe>(`${this.baseUrl}/${id}`, command)
  }
}

