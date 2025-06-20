import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser, UpdateUser } from '../interfaces/users';

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
    
      getAll() {
        const users = this.http.get(this.baseUrl)
        return users
      }
    
      create(command: CreateUser) {
        this.http.post(this.baseUrl, command)
      }
    
      delete(id: string) {
        this.http.delete(this.baseUrl + "/" + id)
        return "deleted item: " + id
      }
    
      update(command: UpdateUser) {
        this.http.patch(this.baseUrl + "/" + command.id, command)
      }
}
