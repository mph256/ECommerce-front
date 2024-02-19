import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { confirmEqualValidator } from '../../../shared/validators/confirm-equal.validator';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { UserService } from '../../../shared/services/user/user.service';

import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss']
})
export class PasswordFormComponent implements OnInit {

  passwordForm!: FormGroup;

  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;

  user$!: Observable<User>;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {

    this.passwordCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(8), Validators.maxLength(70)]);
    this.confirmPasswordCtrl = this.formBuilder.control(null, Validators.required);

    this.passwordForm = this.formBuilder.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, 
    { validators: [confirmEqualValidator('password', 'confirmPassword')],
      updateOn: 'blur'
    });

    this.passwordForm.statusChanges.pipe(
      tap(status => {

        if(status === 'INVALID' && this.passwordCtrl.value && this.confirmPasswordCtrl.value && this.passwordForm.hasError('confirmEqual'))
          this.confirmPasswordCtrl.setErrors({ 'confirmEqual': true });

        if(!this.passwordForm.hasError('confirmEqual') && this.confirmPasswordCtrl.value)
          this.confirmPasswordCtrl.setErrors(null);

      })
    ).subscribe();

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('confirmEqual'))
      return 'Your passwords must match';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength'))
      return 'Your password must be between 8 and 70 characters long';
    else
      return 'This field contains an error';

  }

  onUpdatePassword(): void {

    this.loading = true;

    this.userService.updatePassword(this.passwordForm.value.password, this.passwordForm.value.confirmPassword, this.authService.getUserUsername()).pipe(
      tap(() => this.router.navigateByUrl('/account/settings')),
      catchError(error => {

        this.message = 'An error has occurred';

        setTimeout(() => { 
          this.message = '';
        }, 5000);

        throw error;

      }),
      finalize(() => this.loading = false)
    ).subscribe();

  }

  onCancel(): void {
    this.router.navigateByUrl('/account/settings');
  }

}
