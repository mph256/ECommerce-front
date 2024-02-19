import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { dateValidator } from '../../../shared/validators/date.validator';

import { PromotionService } from '../../services/promotion/promotion.service';

import { Promotion } from '../../../shared/models/promotion.model';

@Component({
  selector: 'app-promotion-form',
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss']
})
export class PromotionFormComponent implements OnInit {

  @Input()
  formType!: 'add' | 'update' | 'delete';

  promotionForm!: FormGroup;

  codeCtrl!: FormControl;
  percentageCtrl!: FormControl;
  expirationDateCtrl!: FormControl;

  minDate!: Date;
  maxDate!: Date;

  promotions$!: Observable<Promotion[]>;

  activePromotions: Promotion[] = [];

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private promotionService: PromotionService) { }

  ngOnInit(): void {

    this.initForm();

    if('update' === this.formType || 'delete' === this.formType) {

      this.promotionService.getPromotions();

      if('update' === this.formType)
        this.promotions$ = this.promotionService.promotions$.pipe(
          tap(promotions => this.activePromotions = promotions.filter(promotion => new Date(promotion.expirationDate) >= new Date()))
        );
      else
        this.promotions$ = this.promotionService.promotions$;

    }

  }

  initForm(): void {

    if('add' === this.formType || 'update' === this.formType) {

      this.codeCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
      this.percentageCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(5), Validators.max(50)]);
      this.expirationDateCtrl = this.formBuilder.control(null, [Validators.required, dateValidator()]);

      this.minDate = this.addDaysToDate(new Date(), 1);
      this.maxDate = this.addMonthsToDate(new Date(), 1);

    }

    switch(this.formType) {

      case 'add': {
        this.promotionForm = this.formBuilder.group({
          code: this.codeCtrl,
          percentage: this.percentageCtrl,
          expirationDate: this.expirationDateCtrl
        });
        break;
      }

      case 'update': {
        this.promotionForm = this.formBuilder.group({
          promotion: [null, Validators.required],
          code: this.codeCtrl,
          percentage: this.percentageCtrl,
          expirationDate: this.expirationDateCtrl
        });
        break;
      }

      case 'delete': {
        this.promotionForm = this.formBuilder.group({
          promotion: [null, Validators.required]
        });
        break;
      }

    }

  }

  addDaysToDate(date: Date, days: number): Date {

    date.setDate(date.getDate() + days);

    return date;

  }

  addMonthsToDate(date: Date, months: number): Date {

    date.setMonth(date.getMonth() + months);

    return date;

  }

  stringToDate(param: string): Date {

    const date = new Date(param);

    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if(month.length < 2) 
      month = '0' + month;

    if(day.length < 2) 
      day = '0' + day;

    return new Date([year, month, day].join('-'));

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern'))
      return 'Your percentage is invalid';
    else if(ctrl.hasError('date'))
      return 'Your date is invalid';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength'))
      return 'Your code must be between 3 and 20 characters long';
    else if(ctrl.hasError('min') || ctrl.hasError('max'))
      return 'Your percentage must be between 5 and 50%';
    else
      return 'This field contains an error';

  }

  onPromotionChange(promotion: Promotion): void {

    this.promotionForm.patchValue({
      code: promotion.code,
      percentage: promotion.percentage,
      expirationDate: promotion.expirationDate
    });

  }

  onSubmit(): void {

    this.loading = true;

    if('add' === this.formType)
      this.promotionService.addPromotion(this.promotionForm.value.code, this.promotionForm.value.percentage, this.stringToDate(this.promotionForm.value.expirationDate));
    else if('update' === this.formType)
      this.promotionService.updatePromotion(this.promotionForm.value.promotion, this.promotionForm.value.code, this.promotionForm.value.percentage, this.stringToDate(this.promotionForm.value.expirationDate));
    else
      this.promotionService.deletePromotion(this.promotionForm.value.promotion);

    this.promotionForm.reset();

    this.message = 'Operation completed';

    setTimeout(() => { 
      this.message = '';
    }, 5000);

    this.loading = false;

  }

}
