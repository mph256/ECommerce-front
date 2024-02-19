import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';

import { UserService } from './services/user/user.service';
import { RoleService } from './services/role/role.service';
import { PromotionService } from './services/promotion/promotion.service';

import { AdminComponent } from './components/admin/admin.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { PromotionFormComponent } from './components/promotion-form/promotion-form.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';

@NgModule({
  declarations: [
    AdminComponent,
    RoleFormComponent,
    PromotionFormComponent,
    CategoryFormComponent
  ],
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
