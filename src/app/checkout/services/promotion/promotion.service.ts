import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Promotion } from '../../../shared/models/promotion.model';

@Injectable()
export class PromotionService {

  constructor(private http: HttpClient) { }

  getPromotionByCode(code: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${environment.apiUrl}/promotions/${code}`);
  }

}
