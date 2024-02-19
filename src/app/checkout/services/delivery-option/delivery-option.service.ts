import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { DeliveryOption } from '../../../shared/models/delivery-option.model';

@Injectable()
export class DeliveryOptionService {

  constructor(private http: HttpClient) { }

  getDeliveryOptions(): Observable<DeliveryOption[]> {
    return this.http.get<DeliveryOption[]>(`${environment.apiUrl}/delivery-options`);
  }

}
