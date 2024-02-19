import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { UserService } from '../../../shared/services/user/user.service';

import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html',
  styleUrls: ['./phone-form.component.scss']
})
export class PhoneFormComponent implements OnInit {

  phoneForm!: FormGroup;

  phoneCtrl!: FormControl;

  user$!: Observable<User>;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    this.initForm();

    this.user$ = this.userService.getUserByUsername(this.authService.getUserUsername()).pipe(
      tap(user => {
        this.phoneCtrl.patchValue(user.phone);
      })
    );

  }

  initForm(): void {

    this.phoneCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(4), Validators.maxLength(15)]);

    this.phoneForm = this.formBuilder.group({
      phone: this.phoneCtrl
    });

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('conflict'))
      return 'Phone number already in use';
    else if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern'))
      return 'Your phone number is invalid';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength'))
      return 'Your phone number must be between 4 and 15 characters long';
    else
      return 'This field contains an error';

  }

  handleError(error: HttpErrorResponse): never {

    if(409 === error.status) {

      this.phoneCtrl.setErrors({ 'conflict': true }); 
      this.phoneCtrl.markAsTouched();

    } else {

      this.message = 'An error has occurred';

      setTimeout(() => { 
        this.message = '';
      }, 5000);

    }

    throw error;

  }

  onUpdatePhone(): void {

    this.loading = true;

    this.userService.updatePhone(this.phoneForm.value.phone, this.authService.getUserUsername()).pipe(
      tap(() => this.router.navigateByUrl('/account/settings')),
      catchError(error => this.handleError(error)),
      finalize(() => this.loading = false)
    ).subscribe();

  }

  onCancel(): void {
    this.router.navigateByUrl('/account/settings');
  }

}
