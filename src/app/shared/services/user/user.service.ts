import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${username}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  updateFirstname(firstname: string, username: string): Observable<User> {

    const formData = new FormData();

    formData.append('firstname', firstname);
  
    return this.http.patch<User>(
      `${environment.apiUrl}/users/${username}/firstname`,
      formData
    );

  }

  updateLastname(lastname: string, username: string): Observable<User> {

    const formData = new FormData();

    formData.append('lastname', lastname);

    return this.http.patch<User>(
      `${environment.apiUrl}/users/${username}/lastname`,
      formData
    );

  }

  updateEmail(email: string, username: string): Observable<User> {

    const formData = new FormData();

    formData.append('email', email);

    return this.http.patch<User>(
      `${environment.apiUrl}/users/${username}/email`,
      formData,
    );

  }

  updatePhone(phone: string, username: string): Observable<User> {

    const formData = new FormData();

    formData.append('phone', phone);

    return this.http.patch<User>(
      `${environment.apiUrl}/users/${username}/phone`,
      formData
    );

  }

  updatePassword(password: string, confirmPassword: string, username: string): Observable<User> {

    const formData = new FormData();

    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);

    return this.http.patch<User>(
      `${environment.apiUrl}/users/${username}/password`,
      formData
    );

  }

  addUserRole(user: User, role: string): Observable<User> {

    const formData = new FormData();

    formData.append('role', role);

    return this.http.patch<User>(
      `${environment.apiUrl}/users/${user.username}/roles/add`,
      formData
    );

  }

  removeUserRole(user: User, role: string): Observable<User> {

    const formData = new FormData();

    formData.append('role', role);

    return this.http.patch<User>(
      `${environment.apiUrl}/users/${user.username}/roles/remove`,
      formData
    );

  }

}
