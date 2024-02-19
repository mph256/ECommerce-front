import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckoutRoutingModule,
    SharedModule
  ],
  providers: []
})
export class CheckoutModule { }
