import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser, UpdateUser, User } from '../interfaces/users';
import { firstValueFrom, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = "http://localhost:3002/users"

  constructor(private readonly http: HttpClient) { }


  get(id: string) {
    const user = this.http.get(this.baseUrl + "/" + id)
    return user
  }

  getByToken(token: string) {
    return firstValueFrom(
      this.http.get<User>(this.baseUrl + "/token/" + token).pipe(take(1))
    );
  }

  getAll() {
    const users = this.http.get(this.baseUrl)
    return users
  }

  create(command: CreateUser) {
    this.http.post(this.baseUrl + '/create', command).pipe(take(1)).subscribe({
      next: (res) => console.log('Usuario creado', res),
      error: (err) => console.error('Error', err)
    });
  }

  delete(id: string) {
    this.http.delete(this.baseUrl + "/" + id).pipe(take(1)).subscribe({
      next: (res) => console.log('Usuario eliminado', res),
      error: (err) => console.error('Error', err)
    });
  }

  update(command: UpdateUser) {
    this.http.patch(this.baseUrl + "/" + command.id, command).pipe(take(1)).subscribe({
      next: (res) => console.log('Usuario actualizado', res),
      error: (err) => console.error('Error', err)
    });
  }
}
