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
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { AddVehicleComponent } from './dialogs/add-vehicle/add-vehicle.component';
import { YearPickerComponent } from './components/year-picker/year-picker.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ViewVehicleComponent } from './dialogs/view-vehicle/view-vehicle.component';
import { UpdateVehicleComponent } from './dialogs/update-vehicle/update-vehicle.component';
import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingInterceptor } from './services/interceptors/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BaseComponent,
    DashboardComponent,
    BarComponent,
    VehicleTableComponent,
    VehiclesComponent,
    AddVehicleComponent,
    YearPickerComponent,
    UploadFileComponent,
    ViewVehicleComponent,
    UpdateVehicleComponent,
    ConfirmationComponent,
    ProfileComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgChartsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
