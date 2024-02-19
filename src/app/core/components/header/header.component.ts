import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { CategoryService } from '../../../shared/services/category/category.service';
import { CartService } from '../../../shared/services/cart/cart.service';

import { Category } from '../../../shared/models/category.model';
import { Cart } from '../../../shared/models/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchForm!: FormGroup;

  categories$!: Observable<Category[]>;
  cart$!: Observable<Cart>;

  productsInCart!: number;

  isAuthenticated = false;

  isSeller = false;
  isAdmin = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private categoryService: CategoryService, private cartService: CartService) { }

  ngOnInit(): void {

    this.initForm();

    this.cartService.getCartByUserUsername((this.authService.isAuthenticated())?this.authService.getUserUsername():'');
    this.cart$ = this.cartService.cart$.pipe(
      tap(cart => this.productsInCart = this.getProductsInCart(cart))
    );

    this.authService.isAuthenticated$.pipe(
      tap(isAuthenticated => this.getUserRoles(isAuthenticated))
    ).subscribe();

  }

  initForm(): void {

    this.searchForm = this.formBuilder.group({
      category: null,
      search: null
    });

  }

  getProductsInCart(cart: Cart): number {

    let productsInCart = 0;

    cart.items.forEach(item => productsInCart += item.quantity);

    return productsInCart;

  }

  getUserRoles(isAuthenticated: boolean): void {

    this.isAuthenticated = isAuthenticated;

    if(isAuthenticated) {

      const roles = this.authService.getUserRoles();

      this.isSeller = roles.indexOf('SELLER') !== -1;
      this.isAdmin = roles.indexOf('ADMIN') !== -1;

    } else {

      this.isSeller = false;
      this.isAdmin = false;

    }

  }

  onGoHome(): void {
    this.router.navigateByUrl('/home');
  }

  onSearch(): void {

    if(this.searchForm.value.category && this.searchForm.value.search) {

      this.router.navigateByUrl(`/categories/${this.searchForm.value.category.name.toLowerCase()}/products?search=${this.searchForm.value.search.toLowerCase()}`);

      this.searchForm.reset();

    }

  }

  onSignOut(): void {

    this.authService.signOut().subscribe();

    this.router.navigateByUrl('/home');

  }

}
