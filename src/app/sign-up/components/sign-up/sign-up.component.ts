import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, finalize, tap } from 'rxjs/operators';

import { confirmEqualValidator } from '../../../shared/validators/confirm-equal.validator';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { CartService } from '../../../shared/services/cart/cart.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm!: FormGroup;

  usernameCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  emailCtrl!: FormControl;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private cartService: CartService) { }

  ngOnInit(): void {

    if(this.authService.isAuthenticated())
      this.router.navigateByUrl('/home');
    else
      this.initForm();

  }

  initForm(): void {

    this.usernameCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[^\\s]*$'), Validators.minLength(3), Validators.maxLength(20)]);
    this.passwordCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(70)]);
    this.confirmPasswordCtrl = this.formBuilder.control(null, Validators.required);
    this.emailCtrl = this.formBuilder.control(null, [Validators.required, Validators.email]);

    this.signUpForm = this.formBuilder.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl,
      email: this.emailCtrl
    }, 
    { validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
    });

    this.signUpForm.statusChanges.pipe(
      tap(status => {

        if(status === 'INVALID' && this.passwordCtrl.value && this.confirmPasswordCtrl.value && this.signUpForm.hasError('confirmEqual'))
          this.confirmPasswordCtrl.setErrors({ 'confirmEqual': true });

        if(!this.signUpForm.hasError('confirmEqual') && this.confirmPasswordCtrl.value)
          this.confirmPasswordCtrl.setErrors(null);

      })
    ).subscribe();

  }

  getFormControlName(control: AbstractControl): string | null {
    return Object.entries(control.parent?.controls ?? []).find(([_, value]) => value === control)?.[0] ?? null;
  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern'))
      return 'Your username is invalid';
    else if(ctrl.hasError('confirmEqual'))
      return 'Your passwords must match';
    else if(ctrl.hasError('email'))
      return 'Your email is invalid';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength')) {

      if('username' === this.getFormControlName(ctrl))
        return 'Your username must be between 3 and 20 characters long';
      else
        return 'Your password must be between 8 and 70 characters long';

    } else
      return 'This field contains an error';

  }

  handleError(error: HttpErrorResponse): never {

    if(409 === error.status)
      this.message = 'Username or email already in use';
    else
      this.message = 'An error has occurred';

    setTimeout(() => { 
      this.message = '';
    }, 5000);

    throw error;

  }

  onSignUp(): void {

    this.loading = true;

    this.authService.signUp(this.signUpForm.value.username, this.signUpForm.value.password, this.signUpForm.value.confirmPassword, this.signUpForm.value.email).pipe(
      tap(() => this.cartService.updateCart(this.signUpForm.value.username)),
      tap(() => this.router.navigateByUrl('/home')),
      catchError(error => this.handleError(error)),
      finalize(() => this.loading = false)
    ).subscribe();

  }

  onCancel(): void {
    this.router.navigateByUrl('/sign-in');
  }

}
