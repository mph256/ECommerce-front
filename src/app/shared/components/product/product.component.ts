import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  @Input()
  product!: Product;

  @Input()
  isOrdersPage = false;

  @Output()
  addToCartEvent = new EventEmitter<Product>();

  @Output()
  viewProductEvent = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCartEvent.emit(this.product);
  }

  onViewProduct(): void {
    this.viewProductEvent.emit(this.product);
  }

}
