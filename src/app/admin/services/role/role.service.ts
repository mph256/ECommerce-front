import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable()
export class RoleService {

  constructor(private http: HttpClient) { }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/roles`)
  }

}
