import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AccountComponent } from './components/account/account.component';
import { AddressListComponent } from './components/address-list/address-list.component';
import { AddressComponent } from './components/address/address.component';
import { CreditCardListComponent } from './components/credit-card-list/credit-card-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NameFormComponent } from './components/name-form/name-form.component';
import { EmailFormComponent } from './components/email-form/email-form.component';
import { PhoneFormComponent } from './components/phone-form/phone-form.component';
import { PasswordFormComponent } from './components/password-form/password-form.component';

@NgModule({
  declarations: [
    AccountComponent,
    AddressListComponent,
    AddressComponent,
    CreditCardListComponent,
    SettingsComponent,
    NameFormComponent,
    EmailFormComponent,
    PhoneFormComponent,
    PasswordFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
