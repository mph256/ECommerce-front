import { Component, OnInit } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { ReviewService } from '../../services/review/review.service';

import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {

  reviews$!: Observable<Review[]>;

  reviewsToShow!: Review[];

  reviewsPerPage = 5;

  username!: string;

  constructor(private authService: AuthService, private reviewService: ReviewService) { }

  ngOnInit(): void {

    this.reviews$ = this.reviewService.reviews$.pipe(
      tap(reviews => this.reviewsToShow = reviews.slice(0, this.reviewsPerPage))
    );

    this.username = this.authService.isAuthenticated()?this.authService.getUserUsername():'';

  }

  onDeleteReview(review: Review): void {
    this.reviewService.deleteReview(review);
  }

  onPage(event: PageEvent, reviews: Review[]): void {
    this.reviewsToShow = reviews.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);

  }

}
