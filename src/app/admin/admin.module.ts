import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { UserService } from './services/user/user.service';
import { RoleService } from './services/role/role.service';
import { PromotionService } from './services/promotion/promotion.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule
  ],
  providers: [
    UserService,
    RoleService,
    PromotionService
  ]
})
export class AdminModule { }
