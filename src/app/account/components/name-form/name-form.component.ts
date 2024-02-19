import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { UserService } from '../../../shared/services/user/user.service';

import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss']
})
export class NameFormComponent implements OnInit {

  nameForm!: FormGroup;

  firstnameCtrl!: FormControl;
  lastnameCtrl!: FormControl;

  user$!: Observable<User>;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {

    this.initForm();

    this.user$ = this.userService.getUserByUsername(this.authService.getUserUsername()).pipe(
      tap(user => {
        this.firstnameCtrl.patchValue(user.firstname);
        this.lastnameCtrl.patchValue(user.lastname);
      })
    );

  }

  initForm(): void {

    this.firstnameCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.lastnameCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);

    this.nameForm = this.formBuilder.group({
      firstname: this.firstnameCtrl,
      lastname: this.lastnameCtrl
    });

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength'))
      return 'Your name must be between 3 and 50 characters long';
    else
      return 'This field contains an error';

  }

  onUpdateName(): void {

    this.loading = true;

    const username = this.authService.getUserUsername();

    this.userService.updateFirstname(this.nameForm.value.firstname, username).pipe(
      switchMap(() => this.userService.updateLastname(this.nameForm.value.lastname, username).pipe(
        tap(() => this.router.navigateByUrl('/account/settings')),
        catchError(error => {

          this.message = 'An error has occurred';

          setTimeout(() => { 
            this.message = '';
          }, 5000);

          throw error;

        })
      )),
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
