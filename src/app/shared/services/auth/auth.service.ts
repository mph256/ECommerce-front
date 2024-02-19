import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../../environments/environment';

import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated$ = new BehaviorSubject<boolean>(this.isAuthenticated());
  get isAuthenticated$(): Observable<boolean> {
    return this._isAuthenticated$.asObservable();
  }

  constructor(private http: HttpClient) { }

  signUp(username: string, password: string, confirmPassword: string, email: string): Observable<any> {

    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('email', email);

    return this.http.post<any>(
      `${environment.apiUrl}/auth/sign-up`,
      formData
    ).pipe(
      tap(data => this.loadAccessToken(data))
    );

  }

  signIn(username: string, password: string): Observable<any> {

    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    return this.http.post<any>(
      `${environment.apiUrl}/auth/sign-in`,
      formData
    ).pipe(
      tap(data => this.loadAccessToken(data))
    );

  }

  signOut(): Observable<any> {

    const formData = new FormData();

    formData.append('username', this.getUserUsername());

    return this.http.post<any>(
      `${environment.apiUrl}/auth/sign-out`,
      formData
    ).pipe(
      tap(() => localStorage.removeItem('accessToken')),
      tap(() => this._isAuthenticated$.next(false))
    );

  }

  loadAccessToken(data: any): void {

    localStorage.setItem('accessToken', data['access-token']);

    this._isAuthenticated$.next(true);

  }

  isAuthenticated(): boolean {
    return localStorage.getItem('accessToken')?true:false;
  }

  getAccessToken(): string {

    const accessToken = localStorage.getItem('accessToken');

    return accessToken?accessToken:'';

  }

  getUserUsername(): string {

    const accessToken = localStorage.getItem('accessToken');

    if(accessToken) {

      const decodedJwt: any = jwtDecode(accessToken);

      return decodedJwt.sub;

    }

    return '';

  }

  getUserRoles(): string[] {

    const accessToken = localStorage.getItem('accessToken');

    if(accessToken) {

      const decodedJwt: any = jwtDecode(accessToken);

      return decodedJwt.scope.split(' ');

    }

    return [];

  }

}
