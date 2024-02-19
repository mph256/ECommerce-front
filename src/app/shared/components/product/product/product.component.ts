import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CartService } from '../../../services/cart/cart.service';

import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  @Input()
  product!: Product;

  @Input()
  isOrdersPage: boolean = false;

  constructor(private router: Router,
    private cartService: CartService) { }

  onAddItemToCart(): void {
    this.cartService.addItem(this.product, 1, false);
  }

  onClick(): void {
    this.router.navigateByUrl(`/categories/${this.product.categories[0].name.toLowerCase()}/products/${this.product.id}`);
  }

}
