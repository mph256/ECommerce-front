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
  { 
    path: 'orders',
    canActivate: [authenticationGuard],
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule) 
  },
  { 
    path: 'returns', 
    canActivate: [authenticationGuard],
    loadChildren: () => import('./return/return.module').then(m => m.ReturnModule) 
  },
  { path: 'cart', 
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) 
  },
  { 
    path: 'checkout', 
    canActivate: [authenticationGuard],
    loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule) 
  },
  { 
    path: 'best-sellers', 
    loadChildren: () => import('./best-seller/best-seller.module').then(m => m.BestSellerModule) 
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
