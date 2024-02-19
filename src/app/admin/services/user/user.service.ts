import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { User } from '../../../shared/models/user.model';

@Injectable()
export class UserService {

  private _users$ = new BehaviorSubject<User[]>([]);
  get users$(): Observable<User[]> {
    return this._users$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getUsers(): void {

    this.http.get<User[]>(`${environment.apiUrl}/users`).pipe(
      tap(users => this._users$.next(users))
    ).subscribe();

  }

  addUserRole(user: User, roleToAdd: string): void {

    const formData = new FormData();

    formData.append('role', roleToAdd);

    this.http.patch<User>(
      `${environment.apiUrl}/users/${user.username}/roles/add`,
      formData
    ).pipe(
      map(userToUpdate => { const users = this._users$.getValue(); const user = users.find(user => userToUpdate.username === user.username);
        if(user) { user.roles = userToUpdate.roles; } return users; }),
      tap(users => this._users$.next(users))
    ).subscribe();

  }

  removeUserRole(user: User, roleToRemove: string): void {

    const formData = new FormData();

    formData.append('role', roleToRemove);

    this.http.patch<User>(
      `${environment.apiUrl}/users/${user.username}/roles/remove`,
      formData
    ).pipe(
      map(userToUpdate => { const users = this._users$.getValue(); const user = users.find(user => userToUpdate.username === user.username);
        if(user) { user.roles = userToUpdate.roles; } return users; }),
      tap(users => this._users$.next(users))
    ).subscribe();

  }

}
