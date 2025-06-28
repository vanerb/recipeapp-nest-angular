import { Injectable } from '@angular/core';
import { CreateRecipe, Recipe, Recipes, UpdateRecipe } from '../interfaces/recipes';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  baseUrl = "http://localhost:3002/recipes"

  constructor(private readonly http: HttpClient) { }


  async get(id: string): Promise<Recipe> {
    const recipes = await firstValueFrom(
      this.http.get<Recipe[]>(this.baseUrl + "/" + id).pipe(take(1))
    );
    return recipes[0];  // Devuelves el único elemento del array
  }


  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl); // si baseUrl no lo incluye ya
  }

  getByUserId(id: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl + "/user/" + id); // si baseUrl no lo incluye ya
  }

  create(command: FormData) {
    this.http.post(this.baseUrl, command).pipe(take(1)).subscribe({
      next: (res) => console.log('Usuario creado', res),
      error: (err) => console.error('Error', err)
    });
  }

  delete(id: string) {
    this.http.delete(this.baseUrl + "/" + id)
    return "deleted item: " + id
  }

  update(command: FormData, id: string) {
    this.http.patch(this.baseUrl + "/" + id, command).pipe(take(1)).subscribe({
      next: (res) => console.log('Usuario creado', res),
      error: (err) => console.error('Error', err)
    });
  }

}
