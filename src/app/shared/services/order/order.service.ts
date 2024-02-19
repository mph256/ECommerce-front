import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Order } from '../../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _orders$ = new BehaviorSubject<Order[]>([]);
  get orders$(): Observable<Order[]> {
    return this._orders$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getUserOrders(username: string): void {
    this.http.get<any[]>(`${environment.apiUrl}/orders/users/${username}`).pipe(
      map(orders => { orders.forEach((order: { suborders: { items: { product: { images: { file: string }[] } }[] }[] }) => order.suborders.forEach((suborder: { items: { product: { images: { file: string; }[] } }[] }) => suborder.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))))); return orders; }),
      tap(orders => this._orders$.next(orders))
    ).subscribe();
  }

  cancelOrder(order: Order): void {

    const formData = new FormData();

    this.http.patch<any>(
      `${environment.apiUrl}/orders/${order.id}/cancel`,
      formData
    ).pipe(
      map(orderToUpdate => { orderToUpdate.suborders.forEach((suborder: { items: { product: { images: { file: string }[] } }[] }) => suborder.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png')))); return orderToUpdate; }),
      map(orderToUpdate => { const orders = this._orders$.getValue(); const order = orders.find(order => orderToUpdate.id === order.id);
        if(order) { order.suborders.forEach(suborder => suborder.status = 'CANCELED'); } return orders; }),
      tap(orders => this._orders$.next(orders))
    ).subscribe();

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
