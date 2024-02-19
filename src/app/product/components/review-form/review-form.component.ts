import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { ReviewService } from '../../services/review/review.service';

import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent implements OnInit {

  @Input()
  productId!: number;

  @Input()
  review!: Review;

  @Output()
  cancelEvent = new EventEmitter<boolean>();

  reviewForm!: FormGroup;

  contentCtrl!: FormControl;

  loading = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {

    if(this.review) {

      this.contentCtrl = this.formBuilder.control(this.review.content, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]);

      this.reviewForm = this.formBuilder.group({
        content: this.contentCtrl,
        rating: [this.review.rating - 1, Validators.required]
      });

    } else {

      this.contentCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]);

      this.reviewForm = this.formBuilder.group({
        content: this.contentCtrl,
        rating: [-1, Validators.required]
      });

    }

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength'))
      return 'Your content must be between 3 and 255 characters long';
    else
      return 'This field contains an error';

  }

  onUpdateRatingEvent(rating: number) {
    this.reviewForm.patchValue({
      rating: rating
    });
  }

  onAddReview(): void {

    this.loading = true;

    this.reviewService.addReview(this.reviewForm.value.content, this.reviewForm.value.rating + 1, this.authService.getUserUsername(), this.productId);

    this.loading = false;

  }

  onUpdateReview(): void {

    this.loading = true;

    this.reviewService.updateReview(this.review, this.reviewForm.value.content, this.reviewForm.value.rating + 1);

    this.loading = false;

    this.cancelEvent.emit(true);

  }

  onCancel(): void {
    this.cancelEvent.emit(true);
  }

}
