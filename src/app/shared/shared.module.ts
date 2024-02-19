import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './modules/material/material.module';

import { CreditCardPipe } from './pipes/credit-card/credit-card.pipe';

@NgModule({
  declarations: [
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
    CreditCardPipe
  ]
})
export class SharedModule { }
