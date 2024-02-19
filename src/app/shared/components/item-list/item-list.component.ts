import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';

import { Item } from '../../models/item.model';
import { Cart } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  @Input()
  page!: 'orders' | 'cart' | 'checkout';

  @Input()
  items!: Item[];

  cart$!: Observable<Cart>;

  itemsToShow!: Item[];

  itemsPerPage = 5;

  constructor(private router: Router, private authService: AuthService, private cartService: CartService) { }

  ngOnInit(): void {

    if('orders' === this.page)
      this.itemsToShow = this.items.slice(0, this.itemsPerPage);
    else
      this.cart$ = this.cartService.cart$.pipe(
        tap(cart => this.itemsToShow = cart.items.slice(0, this.itemsPerPage))
      );

  }

  canAddReview(item: Item): boolean {

    const username = this.authService.isAuthenticated()?this.authService.getUserUsername():'';

    if(item.product.reviews)
      return '' !== username && item.product.reviews.filter(review => username === review.user.username).length === 0;

    return false;

  }

  deleteItem(item: Item): void {
    this.cartService.deleteItem(item, this.authService.isAuthenticated());
  }

  onBuyItAgain(item: Item): void {

    this.cartService.addItem(item.product, 1, false, this.authService.isAuthenticated());

    setTimeout(() => { this.router.navigateByUrl('/cart') }, 1000);

  }

  onAddReview(product: Product): void {
    this.router.navigate([`/categories/${product.categories[0].name.toLowerCase()}/products/${product.id}`], { fragment: 'form-review' });
  }

  onUpdateItemQuantity(param: { item: Item, quantity: number }): void {

    if(param.quantity === 0)
      this.deleteItem(param.item);
    else
      this.cartService.updateItemQuantity(param.item, param.quantity, this.authService.isAuthenticated());

  }

  onUpdateItemIsGift(param: { item: Item, isGift: boolean }) {
    this.cartService.updateItemIsGift(param.item, param.isGift, this.authService.isAuthenticated());
  }

  onDeleteItem(item: Item): void {
    this.deleteItem(item);
  }

  onViewProduct(product: Product) {
    this.router.navigateByUrl(`/categories/${product.categories[0].name.toLowerCase()}/products/${product.id}`);
  }

  onPage(event: PageEvent, items: Item[]): void {
    this.itemsToShow = items.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
