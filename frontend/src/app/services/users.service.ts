import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CreateUser, UpdateUser, User, Users} from '../interfaces/users';
import {firstValueFrom, Observable, take} from 'rxjs';
import {Recipe} from "../interfaces/recipes";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = "http://localhost:3002/users"

  constructor(private readonly http: HttpClient) { }


  get(id: string) {
    return this.http.get<User>(this.baseUrl + "/" + id).pipe(take(1))
  }

  getByToken(token: string) {
    return this.http.get<User>(this.baseUrl + "/token/" + token).pipe(take(1))
  }

  getAll() {
    return this.http.get<User[]>(this.baseUrl)
  }

  create(command: CreateUser) {
    this.http.post(this.baseUrl + '/create', command).pipe(take(1))
  }

  delete(id: string) {
    this.http.delete(this.baseUrl + "/" + id).pipe(take(1))
  }

  update(id: string | undefined, command: UpdateUser){
    return this.http.patch(this.baseUrl + "/" + id, command)
  }
}
