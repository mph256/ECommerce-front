import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './modules/material/material.module';

import { RatingComponent } from './components/rating/rating.component'
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemComponent } from './components/item/item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductComponent } from './components/product/product.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { CreditCardFormComponent } from './components/credit-card-form/credit-card-form.component';

import { CreditCardPipe } from './pipes/credit-card/credit-card.pipe';

@NgModule({
  declarations: [
    RatingComponent,
    ItemListComponent,
    ItemComponent,
    ProductListComponent,
    ProductComponent,
    AddressFormComponent,
    CreditCardFormComponent,
    CreditCardPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    MaterialModule,
    RatingComponent,
    ItemListComponent,
    ItemComponent,
    ProductListComponent,
    ProductComponent,
    AddressFormComponent,
    CreditCardFormComponent,
    CreditCardPipe
  ]
})
export class SharedModule { }
