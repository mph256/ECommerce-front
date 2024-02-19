import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
import { OrderService } from '../../services/order/order.service';

import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  @Input()
  page: 'products' | 'bestSellers' | 'newReleases' | 'orders' = 'products';

  products$!: Observable<Product[]>;

  products: Product[] = [];

  productsToShow!: Product[];

  productsPerPage!: number;

  cols = 6;

  isSearch = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, private productService: ProductService, 
    private cartService: CartService, private orderService: OrderService) { }

  ngOnInit(): void {

    const category = this.activatedRoute.snapshot.params['category'];
    const search = this.activatedRoute.snapshot.queryParams['search'];

    if('orders' !== this.page) {

      this.productsPerPage = 18;

      this.resize(window.innerWidth);

    } else
      this.productsPerPage = 5;

    if(search) {

      this.products$ = this.productService.getProductsByCategoryAndName(category, search).pipe(
        tap(products => this.productsToShow = products.slice(0, this.productsPerPage))
      );

      this.isSearch = true;

    } else {

      if('products' === this.page)
        this.products$ = this.productService.getProductsByCategory(category).pipe(
          tap(products => this.productsToShow = products.slice(0, this.productsPerPage))
        );
      else if('bestSellers' === this.page)
        this.products$  = this.productService.getBestSellers().pipe(
          tap(products => this.productsToShow = products.slice(0, this.productsPerPage))
        );
      else if('newReleases' === this.page)
        this.products$ = this.productService.getNewReleases().pipe(
          tap(products => this.productsToShow = products.slice(0, this.productsPerPage))
        );
      else
        this.orderService.orders$.pipe(
          tap(orders => this.getProductsFromOrders(orders))
        ).subscribe();

    }

    this.activatedRoute.params.subscribe(
      params => { 

        if(params['category']) {

          this.isSearch = this.activatedRoute.snapshot.queryParams['search'] !== undefined;

          if(this.isSearch)
            this.products$ = this.productService.getProductsByCategoryAndName(params['category'], this.activatedRoute.snapshot.queryParams['search']).pipe(
              tap(products => this.productsToShow = products.slice(0, this.productsPerPage))
            ); 

        }

      }
    );

    this.activatedRoute.queryParams.subscribe(
      queryParams => { 

        this.isSearch = queryParams['search'] !== undefined;

        if(this.isSearch)
          this.products$ = this.productService.getProductsByCategoryAndName(this.activatedRoute.snapshot.params['category'], queryParams['search']).pipe(
            tap(products => this.productsToShow = products.slice(0, this.productsPerPage))
          ); 

      }
    );

  }

  getProductsFromOrders(orders: any): void {

    this.products = [];

    for(let order of orders) {

      for(let suborder of order.suborders) {

        for(let item of suborder.items) {

          if(!this.products.find(product => item.product.id === product.id))
            this.products.push(item.product);

        }

      }

    }

    this.products.sort((product1, product2) => product1.name.toLowerCase() > product2.name.toLowerCase()?1:-1);

    this.productsToShow = this.products.slice(0, this.productsPerPage);

  }

  resize(innerWidth: number): void {

    if(innerWidth > 1633)
      this.cols = 6;

    if(innerWidth <= 1633)
      this.cols = 5;

    if(innerWidth <= 1374)
      this.cols = 4;

    if(innerWidth <= 1115)
      this.cols = 3;

    if(innerWidth <= 856)
      this.cols = 2;

    if(innerWidth <= 597)
      this.cols = 1;

  }

  onAddToCart(product: Product): void {
    this.cartService.addItem(product, 1, false, this.authService.isAuthenticated());
  }

  onViewProduct(product: Product): void {
    this.router.navigateByUrl(`/categories/${product.categories[0].name.toLowerCase()}/products/${product.id}`);
  }

  onResize(event: any) {
    this.resize(event.target.innerWidth);
  }

  onPage(event: PageEvent, products: Product[]): void {
    this.productsToShow = products.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
