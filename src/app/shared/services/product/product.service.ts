import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<any>(`${environment.apiUrl}/products/${productId}`).pipe(
      map(product => { product.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png'))); return product; })
    );
  }

  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/products/categories/${categoryName}`).pipe(
      map(products => { products.forEach(product => product.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png')))); return products; })
    );
  }

  getProductsByCategoryAndName(categoryName: string, productName: string): Observable<Product[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/products/categories/${categoryName}/name/${productName}`).pipe(
      map(products => { products.forEach(product => product.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png')))); return products; })
    );
  }

  getBestSellers(): Observable<Product[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/products/best-sellers`).pipe(
      map(products => { products.forEach(product => product.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png')))); return products; })
    );
  }

  getNewReleases(): Observable<Product[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/products/new-releases`).pipe(
      map(products => { products.forEach(product => product.images.forEach((image: { file: string }) => image.file = URL.createObjectURL(this.base64ToBlob(image.file, 'png')))); return products; })
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
