import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { CreditCardService } from '../../../shared/services/credit-card/credit-card.service';

import { CreditCard } from '../../../shared/models/credit-card.model';

@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.scss']
})
export class CreditCardListComponent implements OnInit {

  creditCards$!: Observable<CreditCard[]>;

  dataSource = new MatTableDataSource<CreditCard>([]);

  displayedColumns = ['number', 'holderName', 'expirationDate', 'actions'];

  creditCardsPerPage = 5;

  constructor(private router: Router, private authService: AuthService, private creditCardService: CreditCardService) { }

  ngOnInit(): void {

    this.creditCardService.getUserCreditCards(this.authService.getUserUsername());
    this.creditCards$ = this.creditCardService.creditCards$.pipe(
      tap(creditCards => this.dataSource.data = creditCards.slice(0, this.creditCardsPerPage))
    );

  }

  onAddCreditCard(): void {
    this.router.navigateByUrl('/account/credit-cards/add');
  }

  onDeleteCreditCard(creditCard: CreditCard): void {
    this.creditCardService.deleteCreditCard(creditCard);
  }

  onSetDefaultCreditCard(creditCard: CreditCard): void {
    this.creditCardService.updateUserDefaultCreditCard(creditCard);
  }

  onPage(event: PageEvent, creditCards: CreditCard[]): void {
    this.dataSource.data = creditCards.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
