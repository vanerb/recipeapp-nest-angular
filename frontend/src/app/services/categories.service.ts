import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category, CreateCategory, UpdateCategory} from '../interfaces/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl = "http://localhost:3002/categories"

  constructor(private readonly http: HttpClient) {
  }


  get(id: string) {
    return this.http.get(this.baseUrl + "/" + id)
  }

  getByUserId(id: string) {
    return this.http.get<Category[]>(this.baseUrl + "/byUserId/" + id);
  }

  getAll() {
    return this.http.get<Category[]>(this.baseUrl)
  }

  create(command: CreateCategory) {
    return this.http.post(this.baseUrl, command)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + "/" + id)
  }

  update(command: UpdateCategory, id: string | undefined) {
   return  this.http.patch(this.baseUrl + "/" + id, command)
  }
}
