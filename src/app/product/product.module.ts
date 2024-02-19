import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { ReviewService } from './services/review/review.service';

import { ReviewListComponent } from './components/review-list/review-list.component';
import { ReviewComponent } from './components/review/review.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';

import { TimeAgoPipe } from './pipes/time-ago/time-ago.pipe';

@NgModule({
  declarations: [
    ReviewListComponent,
    ReviewComponent,
    ReviewFormComponent,
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
