import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BaseComponent } from './components/base/base.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/base/dashboard', pathMatch: 'full' }, // redirect to `first-component`
  { path: 'base', redirectTo: '/base/dashboard', pathMatch: 'full' }, // redirect to `first-component`
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(module => module.AuthModule)
  },
  {
    path: 'base', component: BaseComponent, children: [
      { path: 'dashboard', component: DashboardComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }