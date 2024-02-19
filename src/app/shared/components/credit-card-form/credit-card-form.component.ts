import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { dateValidator } from '../../validators/date.validator';

import { AuthService } from '../../services/auth/auth.service';
import { CreditCardService } from '../../services/credit-card/credit-card.service';

@Component({
  selector: 'app-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.scss']
})
export class CreditCardFormComponent implements OnInit {

  @Output()
  cancelEvent = new EventEmitter<boolean>();

  isCheckoutPage!: boolean;

  creditCardForm!: FormGroup;

  numberCtrl!: FormControl;
  holderNameCtrl!: FormControl;
  expirationDateCtrl!: FormControl;
  CVCCtrl!: FormControl;

  minDate!: Date;

  loading = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private creditCardService: CreditCardService) { }

  ngOnInit(): void {

    this.isCheckoutPage = this.router.url.includes('/checkout');

    this.initForm();

  }

  initForm(): void {

    this.numberCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(19)]);
    this.holderNameCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.expirationDateCtrl = this.formBuilder.control(null, [Validators.required, dateValidator()]);
    this.CVCCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(3), Validators.maxLength(3)]);

    this.minDate = new Date();

    this.creditCardForm = this.formBuilder.group({
      number: this.numberCtrl,
      holderName: this.holderNameCtrl,
      expirationDate: this.expirationDateCtrl,
      CVC: this.CVCCtrl
    });

  }

  getFormControlName(control: AbstractControl): string | null {
    return Object.entries(control.parent?.controls ?? []).find(([_, value]) => value === control)?.[0] ?? null;
  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern')) {

      if('number' === this.getFormControlName(ctrl))
        return 'Your card number is invalid';
      else
        return 'Your CVC is invalid';

    } else if(ctrl.hasError('date'))
      return 'Your date is invalid';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength')) {

      if('number' === this.getFormControlName(ctrl))
        return 'Your card number must be between 8 and 19 characters long';
      else if('holderName' === this.getFormControlName(ctrl))
        return 'Your name must be between 3 and 50 characters long';
      else
        return 'Your CVC must be 3 characters long';

    } else
      return 'This field contains an error';

  }

  onAddCreditCard(): void {

    this.loading = true;

    this.creditCardService.addCreditCard(this.creditCardForm.value.number, this.creditCardForm.value.holderName, this.creditCardForm.value.expirationDate, this.creditCardForm.value.CVC, 
      this.authService.getUserUsername());

    this.creditCardForm.reset();

    this.loading = false;

    if(this.isCheckoutPage)
      this.cancelEvent.emit(true);
    else
      this.router.navigateByUrl('/account/credit-cards');

  }

  onCancel(): void {

    if(this.isCheckoutPage)
      this.cancelEvent.emit(true);
    else
      this.router.navigateByUrl('/account/credit-cards');

  }

}
