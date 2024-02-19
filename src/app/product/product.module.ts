import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { ReviewService } from './services/review/review.service';

import { TimeAgoPipe } from './pipes/time-ago/time-ago.pipe';

@NgModule({
  declarations: [
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],  
  providers: [
    ReviewService
  ]
})
export class ProductModule { }
