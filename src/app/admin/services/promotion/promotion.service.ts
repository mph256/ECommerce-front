import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Promotion } from '../../../shared/models/promotion.model';

@Injectable()
export class PromotionService {

  private _promotions$ = new BehaviorSubject<Promotion[]>([]);
  get promotions$(): Observable<Promotion[]> {
    return this._promotions$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getPromotions(): void {
    this.http.get<Promotion[]>(`${environment.apiUrl}/promotions`).pipe(
      tap(promotions => this._promotions$.next(promotions))
    ).subscribe();
  }

  addPromotion(code: string, percentage: number, expirationDate: Date): void {

    const formData = new FormData();

    formData.append('code', code);
    formData.append('percentage', percentage as unknown as string);
    formData.append('expirationDate', expirationDate as unknown as string);

    this.http.post<Promotion>(
      `${environment.apiUrl}/promotions`,
      formData
    ).pipe(
      map(promotionToAdd => { const promotions = this._promotions$.getValue(); promotions.push(promotionToAdd); return promotions; }),
      tap(promotions => this._promotions$.next(promotions))
    ).subscribe();

  }

  updatePromotion(promotion: Promotion, code: string, percentage: number, expirationDate: Date): void {

    const formData = new FormData();

    formData.append('code', code);
    formData.append('percentage', percentage as unknown as string);
    formData.append('expirationDate', expirationDate as unknown as string);

    this.http.patch<Promotion>(
      `${environment.apiUrl}/promotions/${promotion.id}`,
      formData
    ).pipe(
      map(promotionToUpdate => { const promotions = this._promotions$.getValue(); const promotion = promotions.find(promotion => promotionToUpdate.id === promotion.id);
        if(promotion) { promotion.code = promotionToUpdate.code; promotion.percentage = promotionToUpdate.percentage; promotion.expirationDate = promotionToUpdate.expirationDate; } return promotions; }),
      tap(promotions => this._promotions$.next(promotions))
    ).subscribe();

  }

  deletePromotion(promotion: Promotion): void {
    this.http.delete<Promotion>(`${environment.apiUrl}/promotions/${promotion.id}`).pipe(
      tap(promotionToDelete => this._promotions$.next(this._promotions$.getValue().filter(promotion => promotionToDelete.id !== promotion.id)))
    ).subscribe();
  }

}
