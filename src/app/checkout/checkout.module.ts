import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../shared/shared.module';

import { PromotionService } from './services/promotion/promotion.service';
import { DeliveryOptionService } from './services/delivery-option/delivery-option.service';
import { OrderService } from './services/order/order.service';

import { CheckoutComponent } from './components/checkout/checkout.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

@NgModule({
  declarations: [
    CheckoutComponent,
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckoutRoutingModule,
    SharedModule
  ],
  providers: [
    PromotionService,
    DeliveryOptionService,
    OrderService
  ]
})
export class CheckoutModule { }
