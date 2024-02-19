import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Product } from '../../../shared/models/product.model';

@Injectable()
export class ProductService {

  private _products$ = new BehaviorSubject<Product[]>([]);
  get products$(): Observable<Product[]> {
    return this._products$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getProductsBySellerUsername(username: string): void {
    this.http.get<any[]>(`${environment.apiUrl}/products/sellers/${username}`).pipe(
      map(products => { products.forEach(product => product.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png')))); return products; }),
      tap(products => this._products$.next(products))
    ).subscribe();
  }

  addProduct(name: string, description: string, dimensions: string, weight: number, countryOfOrigin: string, manufacturer: string, 
    quantityAvailable: number, price: number, username: string, images: File[], categories: number[]): void {

    if(!dimensions)
      dimensions = "N/A";

    if(!weight)
      weight = 0;

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('dimensions', dimensions);
    formData.append('weight', weight as unknown as string);
    formData.append('countryOfOrigin', countryOfOrigin);
    formData.append('manufacturer', manufacturer);
    formData.append('quantityAvailable', quantityAvailable as unknown as string);
    formData.append('price', price as unknown as string);
    formData.append('username', username);

    for(let image of images) {
      formData.append('files', image);
    }
    
    formData.append('categories', categories as unknown as string);

    this.http.post<any>(
      `${environment.apiUrl}/products`,
      formData
    ).pipe(
      map(productToAdd => { productToAdd.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png'))); return productToAdd; }),
      map(productToAdd => { const products = this._products$.getValue(); products.push(productToAdd); return products; }),
      tap(products => this._products$.next(products))
    ).subscribe();

  }

  updateProduct(product: Product, name: string, description: string, dimensions: string, weight: number, countryOfOrigin: string, manufacturer: string, 
    quantityAvailable: number, price: number, username: string, images: File[], categories: number[]): void {

    if(!dimensions)
      dimensions = "N/A";

    if(!weight)
      weight = 0;

    const formData = new FormData();

    formData.append('name', name);
    formData.append('description', description);
    formData.append('dimensions', dimensions);
    formData.append('weight', weight as unknown as string);
    formData.append('countryOfOrigin', countryOfOrigin);
    formData.append('manufacturer', manufacturer);
    formData.append('quantityAvailable', quantityAvailable as unknown as string);
    formData.append('price', price as unknown as string);
    formData.append('username', username);

    for(let image of images) {
      formData.append('files', image);
    }

    formData.append('categories', categories as unknown as string);
    
    this.http.patch<any>(
      `${environment.apiUrl}/products/${product.id}`,
      formData
    ).pipe(
      map(productToUpdate => { productToUpdate.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png'))); return productToUpdate; }),
      map(productToUpdate => { const products = this._products$.getValue(); let product = products.find(product => productToUpdate.id === product.id)
        if(product) { product.name = productToUpdate.name;  product.description = productToUpdate.description; product.dimensions = productToUpdate.dimensions;
          product.weight = productToUpdate.weight; product.countryOfOrigin = productToUpdate.countryOfOrigin; product.manufacturer = productToUpdate.manufacturer;
          product.quantityAvailable = productToUpdate.quantityAvailable; product.price = productToUpdate.price; product.images = productToUpdate.images;
          product.categories = productToUpdate.categories; } return products; }),
      tap(products => this._products$.next(products))
    ).subscribe();

  }

  deleteProduct(product: Product): void {
    this.http.delete<Product>(`${environment.apiUrl}/products/${product.id}`).pipe(
      tap(productToDelete => this._products$.next(this._products$.getValue().filter(product => productToDelete.id !== product.id)))
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
