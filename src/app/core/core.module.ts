import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
})
export class CoreModule { 

  constructor() {
    registerLocaleData(fr.default);
  }

}
