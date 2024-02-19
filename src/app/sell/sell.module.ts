import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SellRoutingModule } from './sell-routing.module';
import { SharedModule } from '../shared/shared.module';

import { OrderService } from './services/order/order.service';
import { SuborderService } from './services/suborder/suborder.service';
import { ProductService } from './services/product/product.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SellRoutingModule,
    SharedModule
  ],
  providers: [
    OrderService,
    SuborderService,
    ProductService
  ]
})
export class SellModule { }
