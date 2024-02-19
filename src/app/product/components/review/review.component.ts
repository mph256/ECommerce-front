import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {

  @Input()
  review!: Review;

  @Input()
  username!: string;

  @Output()
  deleteReviewEvent = new EventEmitter<Review>();

  updateInProgress = false;

  onUpdateReview(): void {
    this.updateInProgress = true;
  }

  onDeleteReview(): void {
    this.deleteReviewEvent.emit(this.review);
  }

  onCancel(): void {
    this.updateInProgress = false;
  }

}
