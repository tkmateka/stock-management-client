import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseComponent } from './components/base/base.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenService } from './services/interceptors/token.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { BarComponent } from './components/charts/bar/bar.component';
import { VehicleTableComponent } from './components/vehicle-table/vehicle-table.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BaseComponent,
    DashboardComponent,
    BarComponent,
    VehicleTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
