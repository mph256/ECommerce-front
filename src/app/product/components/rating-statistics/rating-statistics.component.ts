import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ReviewService } from '../../services/review/review.service';

import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-rating-statistics',
  templateUrl: './rating-statistics.component.html',
  styleUrls: ['./rating-statistics.component.scss']
})
export class RatingStatisticsComponent implements OnInit {

  reviews$!: Observable<Review[]>;

  rating!: number;

  percentages!: number[];

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {

    this.reviews$ = this.reviewService.reviews$.pipe(
      tap(reviews => this.updateStatistics(reviews))
    );

  }

  updateStatistics(reviews: Review[]): void {

    this.rating = 0;
    this.percentages = [0, 0, 0, 0, 0];

    for(let review of reviews) {

      this.rating += review.rating;

      switch(review.rating) {
        case 5: this.percentages[4]++;
          break;
        case 4: this.percentages[3]++;
          break;
        case 3: this.percentages[2]++;
          break;
        case 2: this.percentages[1]++;
          break;
        case 1: this.percentages[0]++;
          break;
      }

    }

    if(reviews.length > 0)
      this.rating /= reviews.length;

    this.percentages[4] /= reviews.length;
    this.percentages[3] /= reviews.length;
    this.percentages[2] /= reviews.length;
    this.percentages[1] /= reviews.length;
    this.percentages[0] /= reviews.length;

  }

}
