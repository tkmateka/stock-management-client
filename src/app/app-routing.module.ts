import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BaseComponent } from './components/base/base.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/base/dashboard', pathMatch: 'full' }, // redirect to `first-component`
  { path: 'base', redirectTo: '/base/dashboard', pathMatch: 'full' }, // redirect to `first-component`
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(module => module.AuthModule)
  },
  {
    path: 'base', component: BaseComponent, canActivate:[authGuard], children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }