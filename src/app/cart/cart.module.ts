import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CartRoutingModule } from './cart-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CartComponent } from './components/cart/cart.component';

@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CartRoutingModule,
    SharedModule
  ]
})
export class CartModule { }
