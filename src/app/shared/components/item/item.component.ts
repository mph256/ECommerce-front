import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { Item } from '../../models/item.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input()
  item!: Item;

  @Input()
  isOrdersPage = false;

  @Input()
  showReviewBtn = false;

  @Output()
  buyItAgainEvent = new EventEmitter<Item>();

  @Output()
  addReviewEvent = new EventEmitter<Product>();

  @Output()
  updateItemQuantityEvent = new EventEmitter<{ item: Item, quantity: number }>();

  @Output()
  updateItemIsGiftEvent = new EventEmitter<{ item: Item, isGift: boolean }>();

  @Output()
  deleteItemEvent = new EventEmitter<Item>();

  @Output()
  viewProductEvent = new EventEmitter<Product>();

  itemForm!: FormGroup;

  quantityCtrl!: FormControl;
  isGiftCtrl!: FormControl;

  loading = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {

    this.quantityCtrl = this.formBuilder.control(this.item.quantity, { validators: [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1), Validators.max(this.item.product.quantityAvailable)], updateOn: 'blur' });
    this.isGiftCtrl = this.formBuilder.control(this.item.isGift, Validators.required);

    this.itemForm = this.formBuilder.group({
      quantity: this.quantityCtrl,
      isGift: this.isGiftCtrl
    });

    this.quantityCtrl.valueChanges.pipe(
      tap(quantity => this.updateItemQuantity(quantity))
    ).subscribe();

    this.isGiftCtrl.valueChanges.pipe(
      tap(isGift => this.updateItemIsGift(isGift))
    ).subscribe();

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern'))
      return 'Your quantity is invalid';
    else if(ctrl.hasError('min'))
      return 'Your quantity must be greater than 0';
    else if(ctrl.hasError('max'))
      return `Your quantity must be less than ${this.item.product.quantityAvailable + 1}`;
    else
      return 'This field contains an error';

  }

  updateItemQuantity(quantity: number): void {

    if(this.quantityCtrl.valid) {

      this.loading = true;

      this.updateItemQuantityEvent.emit({ 'item': this.item, 'quantity': quantity });

      this.loading = false;

    }
  
  }

  updateItemIsGift(isGift: boolean): void {

    this.loading = true;

    this.updateItemIsGiftEvent.emit({ 'item': this.item, 'isGift': isGift });

    this.loading = false;

  }

  onBuyItAgain(): void {

    this.loading = true;

    this.buyItAgainEvent.emit(this.item);

    this.loading = false;

  }

  onAddReview(): void {
    this.addReviewEvent.emit(this.item.product);
  }

  onDeleteItem(): void {

    this.loading = true;

    this.deleteItemEvent.emit(this.item);

    this.loading = false;

  }

  onViewProduct(): void {
    this.viewProductEvent.emit(this.item.product);
  }

}
