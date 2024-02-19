import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
