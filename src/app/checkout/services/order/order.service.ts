import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Address } from '../../../shared/models/address.model';
import { CreditCard } from '../../../shared/models/credit-card.model';
import { Promotion } from '../../../shared/models/promotion.model';
import { DeliveryOption } from '../../../shared/models/delivery-option.model';
import { Order } from '../../../shared/models/order.model';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) { }

  addOrder(shippingAddress: Address, billingAddress: Address, creditCard: CreditCard, promotion: Promotion | null, deliveryOption: DeliveryOption, username: string, ): Observable<Order> {

    const formData = new FormData();

    formData.append('shippingAddressId', shippingAddress.id as unknown as string);
    formData.append('billingAddressId', billingAddress.id as unknown as string);
    formData.append('creditCardId', creditCard.id as unknown as string);
    formData.append('promotionId', (promotion?promotion.id:0) as unknown as string);
    formData.append('deliveryOptionId', deliveryOption.id as unknown as string);
    formData.append('username', username);

    return this.http.post<any>(
      `${environment.apiUrl}/orders`, 
      formData
    ).pipe(
      map(orderToAdd => { orderToAdd.suborders.forEach((suborder: { items: { product: { images: { file: string }[] } }[] }) => suborder.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png')))); return orderToAdd; })
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
