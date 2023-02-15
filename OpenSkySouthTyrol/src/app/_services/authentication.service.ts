//angular imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import environment var
import { environment } from '@environments/environment';
//import user class decalaration
import { User } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('42a6fca59807785cbfee8eda242b16d2f44aea29c33e0bb9285a101b605c4c97304db977f748e4a22f7c0080d6dcba6213b9609facb541a926d381851503a875') ?? '{ "id" : 0}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  //get current user
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/login`, { username, password }).pipe(map(user => {
      localStorage.setItem('42a6fca59807785cbfee8eda242b16d2f44aea29c33e0bb9285a101b605c4c97304db977f748e4a22f7c0080d6dcba6213b9609facb541a926d381851503a875', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    }));
  }

  logout(username: string) {
    // remove user from local storage to log user out
    this.http.post<any>(`${environment.apiUrl}/user/logout`, {username}).subscribe();
    localStorage.removeItem('42a6fca59807785cbfee8eda242b16d2f44aea29c33e0bb9285a101b605c4c97304db977f748e4a22f7c0080d6dcba6213b9609facb541a926d381851503a875');
    this.currentUserSubject.next(new User);
  }

  signup(username: string, email:string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/add`, { username, email, password }).pipe(map(user => {
      return user;
    }));
  }

  changepwd(username:string, oldpwd:string, newpwd:string) {
    return this.http.post<any>(`${environment.apiUrl}/user/chpwd`, { username, oldpwd, newpwd }).pipe(map(user => {
      return user;
    }));
  }
}
