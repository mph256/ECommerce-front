import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Review } from '../../../shared/models/review.model';

@Injectable()
export class ReviewService {

  constructor(private http: HttpClient) { }

  private _reviews$ = new BehaviorSubject<Review[]>([]);
  get reviews$(): Observable<Review[]> {
    return this._reviews$.asObservable();
  }

  getReviewsByProductId(productId: number): void {
    this.http.get<Review[]>(`${environment.apiUrl}/reviews/products/${productId}`).pipe(
      tap(reviews => this._reviews$.next(reviews))
    ).subscribe();
  }

  canAddReview(username: string): boolean {
    return this._reviews$.getValue().filter(review => username === review.user.username).length === 0;
  }

  addReview(content: string, rating: number, username: string, productId: number): void {

    const formData = new FormData();

    formData.append('content', content);
    formData.append('rating', rating as unknown as string);
    formData.append('username', username);
    formData.append('productId', productId as unknown as string);

    this.http.post<Review>(
      `${environment.apiUrl}/reviews`,
      formData
    ).pipe(
      map(reviewToAdd => { const reviews = this._reviews$.getValue(); reviews.push(reviewToAdd); return reviews; }),
      tap(reviews => this._reviews$.next(reviews))
    ).subscribe();

  }

  updateReview(review: Review, content: string, rating: number): void {

    const formData = new FormData();

    formData.append('content', content);
    formData.append('rating', rating as unknown as string);

    this.http.patch<Review>(
      `${environment.apiUrl}/reviews/${review.id}`,
      formData
    ).pipe(
      map(reviewToUpdate => { const reviews = this._reviews$.getValue(); const review = reviews.find(review => reviewToUpdate.id === review.id);
        if(review) { review.content = reviewToUpdate.content; review.rating = reviewToUpdate.rating; } return reviews; }),
      tap(reviews => this._reviews$.next(reviews))
    ).subscribe();

  }

  deleteReview(review: Review): void {
    this.http.delete<Review>(`${environment.apiUrl}/reviews/${review.id}`).pipe(
      tap(reviewToDelete => this._reviews$.next(this._reviews$.getValue().filter(review => reviewToDelete.id !== review.id)))
    ).subscribe();
  }

}
