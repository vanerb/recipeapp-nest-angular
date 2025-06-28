import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categories, CreateCategory, UpdateCategory } from '../interfaces/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

   baseUrl = "http://localhost:3002/categories"
  
    constructor(private readonly http: HttpClient) { }
  
  
    get(id: string) {
      const category = this.http.get(this.baseUrl + "/" + id)
      return category
    }
  
    getAll() {
      const categories = this.http.get<Categories[]>(this.baseUrl)
      return categories
    }
  
    create(command: CreateCategory) {
      this.http.post(this.baseUrl, command)
    }
  
    delete(id: string) {
      this.http.delete(this.baseUrl + "/" + id)
      return "deleted item: " + id
    }
  
    update(command: UpdateCategory) {
      this.http.patch(this.baseUrl + "/" + command.id, command)
    }
}
