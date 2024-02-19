import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { CreditCard } from '../../models/credit-card.model';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  private _creditCards$ = new BehaviorSubject<CreditCard[]>([]);
  get creditCards$(): Observable<CreditCard[]> {
    return this._creditCards$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getUserCreditCards(username: string): void {
    this.http.get<CreditCard[]>(`${environment.apiUrl}/credit-cards/users/${username}`).pipe(
      tap(creditCards => this._creditCards$.next(creditCards))
    ).subscribe();
  }

  addCreditCard(number: number, holderName: string, expirationDate: Date, CVC: number, username: string): void {

    const formData = new FormData();

    formData.append('number', number as unknown as string);
    formData.append('holderName', holderName);
    formData.append('expirationDate', expirationDate as unknown as string);
    formData.append('CVC', CVC as unknown as string);
    formData.append('username', username);

    this.http.post<CreditCard>(
      `${environment.apiUrl}/credit-cards`,
      formData
    ).pipe(
      map(creditCardToAdd => { const creditCards = this._creditCards$.getValue(); creditCards.forEach(creditCard => creditCard.isDefault = false);
      creditCards.push(creditCardToAdd); return creditCards; }),
      tap(creditCards => this._creditCards$.next(creditCards))
    ).subscribe();

  }

  updateUserDefaultCreditCard(newMainCreditCard: CreditCard): void {

    const formData = new FormData();

    formData.append('creditCardId', newMainCreditCard.id as unknown as string);

    this.http.patch<CreditCard>(
      `${environment.apiUrl}/credit-cards/${newMainCreditCard.id}/default`,
      formData
    ).pipe(
      map(creditCardToUpdate => { const creditCards = this._creditCards$.getValue(); 
        const creditCard = creditCards.find(creditCard => creditCardToUpdate.id === creditCard.id);
        if(creditCard) { creditCard.isDefault = true; } return creditCards; }),
      map(creditCards => { creditCards.filter(creditCard => newMainCreditCard.id !== creditCard.id).forEach(creditCard => creditCard.isDefault = false); return creditCards; }),
      tap(creditCards => this._creditCards$.next(creditCards))
    ).subscribe();

  }

  deleteCreditCard(creditCard: CreditCard): void {
    this.http.delete<CreditCard>(`${environment.apiUrl}/credit-cards/${creditCard.id}`).pipe(
      tap(creditCardToDelete => this._creditCards$.next(this._creditCards$.getValue().filter(creditCard => creditCardToDelete.id !== creditCard.id)))
    ).subscribe();
  }

}
