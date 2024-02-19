import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authenticationGuard } from './core/guards/authentication/authentication.guard';

import { HomeComponent } from './core/components/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'sign-up', 
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule) 
  },
  { 
    path: 'sign-in', 
    loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule) 
  },
  { 
    path: 'categories', 
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule) 
  },
  { path: 'products', 
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule) 
  },
  { 
    path: 'account', 
    canActivate: [authenticationGuard],
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule) 
  },
  { path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
