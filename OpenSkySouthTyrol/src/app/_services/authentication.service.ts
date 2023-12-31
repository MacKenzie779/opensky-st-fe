import { ApiResponse } from './../_models/response';
//angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import environment var
import { environment } from '@environments/environment';
//import user class decalaration
import { User } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  //get current user
  public get currentUserValue(): User {
    return JSON.parse(localStorage.getItem(environment.hashObject) ?? '{ "token" : 0}');
  }

  // set current user
  public set currentUserValue(user:User) {
    localStorage.setItem(environment.hashObject, JSON.stringify(user));
  }

  // login
  login(username: string, password: string):Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let body = "user=" + username + "&pass=" + password;
    return this.http.post<ApiResponse>(`${environment.apiUrl}/auth`, body, {headers});
  }

  // logout
  logout() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let body = "authkey="+this.currentUserValue?.token;
    return this.http.post<ApiResponse>(environment.apiUrl + "/logoff", body, {headers});
  }

  //signup
  signup(username: string, email:string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let body = "user=" + username + "&pass=" + password;
    return this.http.post<ApiResponse>(environment.apiUrl + "/createuser", body, {headers});
  }

  // change pwd
  changepwd(newpwd:string):Observable<ApiResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let body = "authkey=" + this.currentUserValue?.token + "&pass=" + newpwd;
    return this.http.post<any>(`${environment.apiUrl}/changepass`, body, {headers});
  }
}
