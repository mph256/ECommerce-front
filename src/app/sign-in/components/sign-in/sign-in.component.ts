import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, finalize, tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { CartService } from '../../../shared/services/cart/cart.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm!: FormGroup;

  usernameCtrl!: FormControl;
  passwordCtrl!: FormControl;

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

    this.usernameCtrl = this.formBuilder.control(null, Validators.required);
    this.passwordCtrl = this.formBuilder.control(null, Validators.required);

    this.signInForm = this.formBuilder.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    });

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else
      return 'This field contains an error';

  }

  handleError(error: HttpErrorResponse): never {

    if(401 === error.status)
      this.message = 'Username or password incorrect';
    else
      this.message = 'An error has occurred';

    setTimeout(() => { 
      this.message = '';
    }, 5000);

    throw error;

  }

  onSignIn(): void {

    this.loading = true;

    this.authService.signIn(this.signInForm.value.username, this.signInForm.value.password).pipe(
      tap(() => this.cartService.updateCart(this.signInForm.value.username)),
      tap(() => this.router.navigateByUrl('/home')),
      catchError(error => this.handleError(error)),
      finalize(() => this.loading = false)
    ).subscribe();

  }

}
