import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input()
  rating = -1;

  @Input()
  readOnly = false;

  @Output()
  updateRatingEvent = new EventEmitter<number>();

  stars!: number[];

  updatedRating!: number;

  updateInProgress = false;

  ngOnInit(): void {

    this.stars = Array(5).fill(0);

    this.updatedRating = this.rating;

  }

  onMouseEnter(index: number): void {

    if(!this.readOnly)
      this.rating = index;

  }

  onMouseLeave(): void {

    if(!this.readOnly) {

      if(this.updateInProgress)
        this.rating = this.updatedRating;
      else
        this.rating = -1;

    }

  }

  onClick(index: number): void {

    if(!this.readOnly) {

      this.rating = index;

      this.updateRatingEvent.emit(this.rating);

      this.updatedRating = this.rating;
      this.updateInProgress = true;

    }

  }

}
