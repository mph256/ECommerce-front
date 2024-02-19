import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _categories$ = new BehaviorSubject<Category[]>([]);
  get categories$(): Observable<Category[]> {
    return this._categories$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getCategories(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).pipe(
      map(categories => { categories.forEach(category => category.image = URL.createObjectURL(this.base64ToBlob(category.image, 'jpeg'))); return categories; }),
      tap(categories => this._categories$.next(categories))
    ).subscribe();
  }

  addCategory(name: string, image: Blob): void {

    const formData = new FormData();

    formData.append('name', name);
    formData.append('file', image);

    this.http.post<any>(
      `${environment.apiUrl}/categories`,
      formData
    ).pipe(
      map(categoryToAdd => { categoryToAdd.image = URL.createObjectURL(this.base64ToBlob(categoryToAdd.image, 'jpeg')); return categoryToAdd; }),
      map(categoryToAdd => { const categories = this._categories$.getValue(); categories.push(categoryToAdd); return categories; }),
      tap(categories => this._categories$.next(categories))
    ).subscribe();

  }

  updateCategory(category: Category, name: string, image: Blob): void {

    const formData = new FormData();

    formData.append('name', name);
    formData.append('file', image);
  
    this.http.patch<any>(
      `${environment.apiUrl}/categories/${category.id}`,
      formData
    ).pipe(
      map(categoryToUpdate => { categoryToUpdate.image = URL.createObjectURL(this.base64ToBlob(categoryToUpdate.image, 'jpeg')); return categoryToUpdate; }),
      map(categoryToUpdate => { const categories = this._categories$.getValue(); const category = categories.find(category => categoryToUpdate.id === category.id);
        if(category) { category.name = categoryToUpdate.name; category.image = categoryToUpdate.image; } return categories; }),
      tap(categories => this._categories$.next(categories))
    ).subscribe();

  }

  deleteCategory(category: Category): void {
    this.http.delete<Category>(`${environment.apiUrl}/categories/${category.id}`).pipe(
      tap(categoryToDelete => this._categories$.next(this._categories$.getValue().filter(category => categoryToDelete.id !== category.id)))
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
