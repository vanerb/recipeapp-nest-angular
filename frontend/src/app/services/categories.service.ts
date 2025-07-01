import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Categories, CreateCategory, UpdateCategory} from '../interfaces/categories';
import {take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl = "http://localhost:3002/categories"

  constructor(private readonly http: HttpClient) {
  }


  get(id: string) {
    return this.http.get(this.baseUrl + "/" + id).pipe(take(1))
  }

  getByUserId(id: string) {
    return this.http.get<Categories[]>(this.baseUrl + "/byUserId/" + id);
  }

  getAll() {
    return this.http.get<Categories[]>(this.baseUrl)
  }

  create(command: CreateCategory) {
    this.http.post(this.baseUrl, command)
  }

  delete(id: string) {
    this.http.delete(this.baseUrl + "/" + id).pipe(take(1));
  }

  update(command: UpdateCategory) {
    this.http.patch(this.baseUrl + "/" + command.id, command).pipe(take(1));
  }
}
