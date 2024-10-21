import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../Interfaces/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl:string;
  private myApiUrl:string;
  constructor(private http:HttpClient) { 
    this.myAppUrl= environment.endPoint;
    this.myApiUrl='api/user/';
  }

  getUserData(userId:number): Observable<any> {
    let token = '';
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}user/${userId}`, { headers });
  }

  SignIn(user:User):Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}`, user);
  }

  login(user:User):Observable<string>{
    return this.http.post<string>(`${this.myAppUrl}${this.myApiUrl}login`, user);
  }

  updateUser(userId: number, updatedData: any): Observable<any> {
    let token = '';
    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('userId varificando ', userId, 'datos a actualizar  ',updatedData,' token que se envia al back', token );
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}update/${userId}`, updatedData, { headers });
  }


}
