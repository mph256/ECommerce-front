import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { ProductService } from '../../../shared/services/product/product.service';
import { CartService } from '../../../shared/services/cart/cart.service';
import { ReviewService } from '../../services/review/review.service';

import { Product } from '../../../shared/models/product.model';
import { Image } from '../../../shared/models/image.model'
import { Review } from '../../../shared/models/review.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  itemForm!: FormGroup;

  quantityCtrl!: FormControl;

  maxQuantity!: number;

  product$!: Observable<Product>;
  reviews$!: Observable<Review[]>;

  imageToShow!: Image;

  showReviewForm = false;

  loading = false;

  constructor(private viewportScroller: ViewportScroller, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, 
    private authService: AuthService, private productService: ProductService, private cartService: CartService, private reviewService: ReviewService) { }

  ngOnInit(): void {

    const productId = this.activatedRoute.snapshot.params['product'];

    this.product$ = this.productService.getProductById(productId).pipe(
      tap(product => this.initForm(product)),
      tap(product => this.imageToShow = product.images[0]),
      tap(product => this.reviewService.getReviewsByProductId(product.id)),
      tap(product => this.reviewService.reviews$.pipe(
          tap(reviews => { product.reviews = reviews; product.rating = this.updateRating(reviews); }),
          tap(() => this.showReviewForm = this.canAddReview())
        ).subscribe()
      )
    );

    this.activatedRoute.fragment.subscribe(fragment => {

      if(fragment)
        setTimeout(() => { 
          this.viewportScroller.scrollToAnchor(fragment);
        }, 500);

    });

  }

  initForm(product: Product): void {

    this.maxQuantity = product.quantityAvailable;

    this.quantityCtrl = this.formBuilder.control(1, { validators: [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(product.quantityAvailable)], updateOn: 'blur' });

    this.itemForm = this.formBuilder.group({
      quantity: this.quantityCtrl,
      isGift: [false, Validators.required]
    });

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern'))
      return 'Your quantity is invalid';
    else if(ctrl.hasError('min'))
      return 'Your quantity must be greater than 0';
    else if(ctrl.hasError('max'))
      return `Your quantity must be less than ${this.maxQuantity + 1}`;
    else
      return 'This field contains an error';

  }

  updateRating(reviews: Review[]): number {

    let rating = 0;

    reviews.forEach(review => rating += review.rating);

    if(reviews.length !== 0)
      rating /= reviews.length;

    return rating;

  }

  canAddReview(): boolean {

    const username = this.authService.isAuthenticated()?this.authService.getUserUsername():'';

    return '' !== username && this.reviewService.canAddReview(username);

  }

  addToCart(product: Product): void {

    this.loading = true;

    this.cartService.addItem(product, this.itemForm.value.quantity, this.itemForm.value.isGift, this.authService.isAuthenticated());

    this.loading = false;

  }

  onImageChange(image: Image): void {
    this.imageToShow = image;
  }

  onAddToCart(product: Product): void {
    this.addToCart(product);
  }

  onBuyNow(product: Product): void {

    this.addToCart(product);

    setTimeout(() => { this.router.navigateByUrl('/checkout') }, 1000);

  }

}
