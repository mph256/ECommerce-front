import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { CartService } from '../../../shared/services/cart/cart.service';

import { Cart } from '../../../shared/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart$!: Observable<Cart>;

  constructor(private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
  }

  onCheckout() {
    this.router.navigateByUrl('/checkout');
  }

}
