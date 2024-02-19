import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AddressFormComponent } from "../shared/components/address-form/address-form.component";
import { CreditCardFormComponent } from "../shared/components/credit-card-form/credit-card-form.component";
import { AccountComponent } from "./components/account/account.component";
import { AddressListComponent } from "./components/address-list/address-list.component";
import { CreditCardListComponent } from "./components/credit-card-list/credit-card-list.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { NameFormComponent } from "./components/name-form/name-form.component";
import { EmailFormComponent } from "./components/email-form/email-form.component";
import { PhoneFormComponent } from "./components/phone-form/phone-form.component";
import { PasswordFormComponent } from './components/password-form/password-form.component';

const routes: Routes = [
  { path: 'credit-cards', component: CreditCardListComponent },
  { path: 'credit-cards/add', component: CreditCardFormComponent },
  { path: 'addresses', component: AddressListComponent },
  { path: 'addresses/add', component: AddressFormComponent },
  { path: 'addresses/:addressId/edit', component: AddressFormComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'name/edit', component: NameFormComponent },
  { path: 'email/edit', component: EmailFormComponent },
  { path: 'phone/edit', component: PhoneFormComponent },
  { path: 'password/edit', component: PasswordFormComponent },
  { path: '', component: AccountComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
