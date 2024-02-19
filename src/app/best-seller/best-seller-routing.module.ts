import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BestSellersComponent } from './components/best-sellers/best-sellers.component';

const routes: Routes = [
  { path: '', component: BestSellersComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class BestSellerRoutingModule { }
