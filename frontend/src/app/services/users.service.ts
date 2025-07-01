import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CreateUser, UpdateUser, User} from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = "http://localhost:3002/users"

  constructor(private readonly http: HttpClient) {
  }


  get(id: string) {
    return this.http.get<User>(this.baseUrl + "/" + id)
  }

  getByToken(token: string) {
    return this.http.get<User>(this.baseUrl + "/token/" + token)
  }

  getAll() {
    return this.http.get<User[]>(this.baseUrl)
  }

  create(command: CreateUser) {
    return this.http.post(this.baseUrl + '/create', command)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + "/" + id)
  }

  update(id: string | null, command: UpdateUser) {
    return this.http.patch(this.baseUrl + "/" + id, command)
  }
}
