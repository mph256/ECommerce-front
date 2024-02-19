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
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss']
})
export class EmailFormComponent implements OnInit {

  emailForm!: FormGroup;

  emailCtrl!: FormControl;

  user$!: Observable<User>;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    this.initForm();

    this.user$ = this.userService.getUserByUsername(this.authService.getUserUsername()).pipe(
      tap(user => {
        this.emailCtrl.patchValue(user.email);
      })
    );

  }

  initForm(): void {

    this.emailCtrl = this.formBuilder.control(null, [Validators.required, Validators.email]);

    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl
    });

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('conflict'))
      return 'Email already in use';
    else if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('email'))
      return 'Your email is invalid';
    else
      return 'This field contains an error';

  }

  handleError(error: HttpErrorResponse): never {

  if(409 === error.status) {

    this.emailCtrl.setErrors({ 'conflict': true }); 
    this.emailCtrl.markAsTouched();

  } else {

      this.message = 'An error has occurred';

      setTimeout(() => { 
        this.message = '';
      }, 5000);

    }

    throw error;

  }

  onUpdateEmail(): void {

    this.loading = true;

    this.userService.updateEmail(this.emailForm.value.email, this.authService.getUserUsername()).pipe(
      tap(() => this.router.navigateByUrl('/account/settings')),
      catchError(error => this.handleError(error)),
      finalize(() => this.loading = false)
    ).subscribe();

  }

  onCancel(): void {
    this.router.navigateByUrl('/account/settings');
  }

}
