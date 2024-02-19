import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ReviewService } from './services/review/review.service';

import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { RatingStatisticsComponent } from './components/rating-statistics/rating-statistics.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewComponent } from './components/review/review.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';

import { TimeAgoPipe } from './pipes/time-ago/time-ago.pipe';

@NgModule({
  declarations: [
    ProductDetailsComponent,
    RatingStatisticsComponent,
    ReviewListComponent,
    ReviewComponent,
    ReviewFormComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    SharedModule
  ],  
  providers: [
    ReviewService
  ]
})
export class ProductModule { }
