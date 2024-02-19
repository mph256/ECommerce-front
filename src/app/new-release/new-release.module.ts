import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewReleaseRoutingModule } from './new-release-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NewReleaseRoutingModule,
    SharedModule
  ]
})
export class NewReleaseModule { }
