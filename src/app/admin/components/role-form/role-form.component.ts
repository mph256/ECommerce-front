import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserService } from '../../services/user/user.service';
import { RoleService } from '../../services/role/role.service';

import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  @Input()
  formType!: 'add' | 'remove';

  roleForm!: FormGroup;

  roleCtrl!: FormControl;

  users$!: Observable<User[]>;
  roles$!: Observable<string[]>;

  roles: { name: string, disabled: boolean }[] = [];

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private roleService: RoleService) { }

  ngOnInit(): void {

    this.initForm();

    this.userService.getUsers();
    this.users$ = this.userService.users$.pipe(
      tap(() => this.roleForm.reset())
    );

    this.roles$ = this.roleService.getRoles().pipe(
      tap(roles => roles.forEach(role => this.roles.push({ name: role, disabled: 'CUSTOMER' === role })))
    );

  }

  initForm(): void {

    this.roleCtrl = this.formBuilder.control(null, Validators.required);

    this.roleForm = this.formBuilder.group({
      user: [null, Validators.required],
      role: this.roleCtrl
    });

  }

  onUserChange(user: User): void {

    const role = this.roleForm.value.role;

    if(role) {

      if('add' === this.formType) {

        if(user.roles.includes(role))
          this.roleCtrl.patchValue(null);

      } else if(!user.roles.includes(role))
        this.roleCtrl.patchValue(null);

    }

    if('add' === this.formType)
      this.roles.forEach(role => role.disabled = (user.roles.find(userRole => role.name === userRole) !== undefined));
    else
      this.roles.forEach(role => role.disabled = ('CUSTOMER' === role.name || user.roles.find(userRole => role.name === userRole) === undefined))

  }

  onSubmit(): void {

    this.loading = true;

    if('add' === this.formType)
      this.userService.addUserRole(this.roleForm.value.user, this.roleForm.value.role);
    else
      this.userService.removeUserRole(this.roleForm.value.user, this.roleForm.value.role);

    this.roleForm.reset();

    this.message = 'Operation completed';

    setTimeout(() => { 
      this.message = '';
    }, 5000);

    this.loading = false;

  }

}
