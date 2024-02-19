import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Cart } from '../../../shared/models/cart.model';
import { Item } from '../../../shared/models/item.model';
import { Product } from '../../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cart$ = new BehaviorSubject<Cart>(new Cart(0, []));
  get cart$(): Observable<Cart> {
    return this._cart$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getCartByUserUsername(username: string): void {

    if('' !== username)
      this.http.get<any>(`${environment.apiUrl}/cart/users/${username}`).pipe(
        map(cart => { cart.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))); return cart; }),
        tap(cart => localStorage.setItem('cart', JSON.stringify(cart))),
        tap(cart => this._cart$.next(cart))
      ).subscribe();
    else {

      const cartFromLocalStorage = localStorage.getItem('cart');
      let cart: Cart;

      if(cartFromLocalStorage)
        cart = JSON.parse(cartFromLocalStorage); 
      else {

        cart = this._cart$.getValue();

        localStorage.setItem('cart', JSON.stringify(cart));

      }

      this._cart$.next(cart);

    }

  }

  updateCart(username: string): void {

    let items: { quantity: number, price: number, isGift: boolean, product: { id: number} }[] = [];

    for(let item of this._cart$.getValue().items) {

      items.push({ 
        'quantity': item.quantity, 
        'price': item.price, 
        'isGift': item.isGift, 
        'product': { 'id': item.product.id }
      });

    }

    const formData = new FormData();

    formData.append('items', items as unknown as string);

    this.http.post<any>(
      `${environment.apiUrl}/cart/users/${username}`,
      items
    ).pipe(
      map(cart => { cart.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))); return cart; }),
      tap(cart => this._cart$.next(cart))
    ).subscribe();

  }

  addItem(productToAdd: Product, quantity: number, isGift: boolean, isAuthenticated: boolean): void {

    if(isAuthenticated) {

      const cartId = this._cart$.getValue().id;

      const formData = new FormData();

      formData.append('quantity', quantity as unknown as string);
      formData.append('isGift', isGift as unknown as string);
      formData.append('productId', productToAdd.id as unknown as string);

      this.http.post<any>(
        `${environment.apiUrl}/cart/${cartId}`,
        formData
      ).pipe(
        map(cart => { cart.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))); return cart; }),
        tap(cart => localStorage.setItem('cart', JSON.stringify(cart))),
        tap(cart => this._cart$.next(cart))
      ).subscribe();

    } else {

      const cart = this._cart$.getValue();
      const price = productToAdd.price * quantity;

      let item = cart.items.filter(item => productToAdd.id === item.product.id)[0];

      if(item) {

        item.quantity += quantity;
        item.price += price;
        item.isGift = isGift;

      } else
        cart.items.push(new Item(quantity, isGift, price, productToAdd));

      cart.amount += price;

      localStorage.setItem('cart', JSON.stringify(cart));

      this._cart$.next(cart);

    }

  }

  updateItemQuantity(itemToUpdate: Item, quantity: number, isAuthenticated: boolean): void {

    if(isAuthenticated) {

      const cartId = this._cart$.getValue().id;

      const formData = new FormData();

      formData.append('quantity', quantity as unknown as string);

      this.http.patch<any>(
        `${environment.apiUrl}/cart/${cartId}/items/${itemToUpdate.id}/quantity`,
        formData
      ).pipe(
        map(cart => { cart.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))); return cart; }),
        tap(cart => localStorage.setItem('cart', JSON.stringify(cart))),
        tap(cart => this._cart$.next(cart))
      ).subscribe();

    } else {

      const cart = this._cart$.getValue();

      cart.items = cart.items.filter(item => itemToUpdate.product.id !== item.product.id);
      cart.amount -= itemToUpdate.price;

      itemToUpdate.quantity = quantity;
      itemToUpdate.price = itemToUpdate.product.price * quantity;

      cart.items.push(itemToUpdate);
      cart.amount += itemToUpdate.price;

      localStorage.setItem('cart', JSON.stringify(cart));

      this._cart$.next(cart);

    }

  }

  updateItemIsGift(itemToUpdate: Item, isGift: boolean, isAuthenticated: boolean): void {

    if(isAuthenticated) {

      const cartId = this._cart$.getValue().id;

      const formData = new FormData();

      formData.append('isGift', isGift as unknown as string);

      this.http.patch<any>(
        `${environment.apiUrl}/cart/${cartId}/items/${itemToUpdate.id}/is-gift`,
        formData
      ).pipe(
        map(cart => { cart.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))); return cart; }),
        tap(cart => localStorage.setItem('cart', JSON.stringify(cart))),
        tap(cart => this._cart$.next(cart))
      ).subscribe();

    } else {

      const cart = this._cart$.getValue();

      cart.items = cart.items.filter(item => itemToUpdate.product.id !== item.product.id);

      itemToUpdate.isGift = isGift;

      cart.items.push(itemToUpdate);

      localStorage.setItem('cart', JSON.stringify(cart));

      this._cart$.next(cart);

    }

  }

  deleteItem(itemToDelete: Item, isAuthenticated: boolean): void {

    if(isAuthenticated) {

      const cartId = this._cart$.getValue().id;

      this.http.delete<any>(`${environment.apiUrl}/cart/${cartId}/items/${itemToDelete.id}`).pipe(
        map(cart => { cart.items.forEach((item: { product: { images: { file: string }[] } }) => item.product.images[0].file = URL.createObjectURL(this.base64ToBlob(item.product.images[0].file, 'png'))); return cart; }),
        tap(cart => localStorage.setItem('cart', JSON.stringify(cart))),
        tap(cart => this._cart$.next(cart))
      ).subscribe();

    } else {

      const cart = this._cart$.getValue();

      cart.items = cart.items.filter(item => itemToDelete.product.id !== item.product.id);
      cart.amount -= itemToDelete.price;

      localStorage.setItem('cart', JSON.stringify(cart));

      this._cart$.next(cart);

    }

  }

  resetCart(): void {

    const cart = this._cart$.getValue();

    cart.items = [];

    this._cart$.next(cart);

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
