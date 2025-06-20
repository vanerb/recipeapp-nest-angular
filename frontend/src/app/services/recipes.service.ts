import { Injectable } from '@angular/core';
import { CreateRecipe, Recipe, Recipes, UpdateRecipe } from '../interfaces/recipes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  baseUrl = "http://localhost:3002/recipes"

  constructor(private readonly http: HttpClient) { }


  get(id: string) {
    const recipe = this.http.get(this.baseUrl + "/" + id)
    return recipe
  }

  getAll() {
    const recipes = this.http.get(this.baseUrl)
    return recipes
  }

  create(command: CreateRecipe) {
    this.http.post(this.baseUrl, command)
  }

  delete(id: string) {
    this.http.delete(this.baseUrl + "/" + id)
    return "deleted item: " + id
  }

  update(command: UpdateRecipe) {
    this.http.patch(this.baseUrl + "/" + command.id, command)
  }

}
