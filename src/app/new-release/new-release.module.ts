import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewReleaseRoutingModule } from './new-release-routing.module';
import { SharedModule } from '../shared/shared.module';

import { NewReleasesComponent } from './components/new-releases/new-releases.component';

@NgModule({
  declarations: [
    NewReleasesComponent
  ],
  imports: [
    CommonModule,
    NewReleaseRoutingModule,
    SharedModule
  ]
})
export class NewReleaseModule { }
