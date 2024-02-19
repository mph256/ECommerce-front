import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Suborder } from '../../../shared/models/suborder.model';

@Injectable()
export class SuborderService {

  constructor(private http: HttpClient) { }

  shipOrder(suborderId: number): Observable<Suborder> {

    const formData = new FormData();

    return this.http.patch<any>(
      `${environment.apiUrl}/suborders/${suborderId}/ship`,
      formData
    ).pipe(
      map(suborderToUpdate => { suborderToUpdate.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))); return suborderToUpdate; })
    );

  }

  private base64ToBlob(base64Data: string, type: string): Blob {

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for(let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: type });

  }

}
