import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BestSellerRoutingModule } from './best-seller-routing.module';
import { SharedModule } from '../shared/shared.module';

import { BestSellersComponent } from './components/best-sellers/best-sellers.component';

@NgModule({
  declarations: [
    BestSellersComponent
  ],
  imports: [
    CommonModule,
    BestSellerRoutingModule,
    SharedModule
  ]
})
export class BestSellerModule { }
