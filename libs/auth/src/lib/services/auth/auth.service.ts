import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Authenticate, User} from '@learning-nx/data-models';
import {BehaviorSubject, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject$ = new BehaviorSubject<User|null>(null);
  user$ = this.userSubject$.asObservable();

  constructor(private httpClient: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject$.next(JSON.parse(user));
    }
  }

  login(authenticate: Authenticate): Observable<User> {
    return this.httpClient
        .post<User>('http://localhost:3000/login', authenticate)
        .pipe(tap((user: User) => {
          this.userSubject$.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', user.token);
        }));
  }

  logout() {
      this.userSubject$.next(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
  }
}
