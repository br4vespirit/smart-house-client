import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent} from "@azure/msal-angular";
import {InteractionType, PublicClientApplication} from "@azure/msal-browser";
import {configuration} from "./auth-config";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './components/navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import { CreateDeviceModalComponent } from './components/dashboard/create-device-modal/create-device-modal.component';
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {NgApexchartsModule} from "ng-apexcharts";
import { DeviceChartComponent } from './components/device-chart/device-chart.component';
import { HistoricalFormComponent } from './components/dashboard/historical-form/historical-form.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import { FormControlPipe } from './pipes/form-control.pipe';
import { SubmitFormComponent } from './components/utils/submit-form/submit-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    CreateDeviceModalComponent,
    DeviceChartComponent,
    HistoricalFormComponent,
    FormControlPipe,
    SubmitFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MsalModule.forRoot(new PublicClientApplication(configuration),
      {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: [
            "https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.write",
            "https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.read",
          ]
        }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ["https://api-smart-house-iot.azurewebsites.net/api/*", ["https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.write",
            "https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.read"]],
          ["https://smart-house-code-generation-function-app.azurewebsites.net/api/*", ["https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.write",
            "https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.read"]],
          ["https://smart-house-historical-data-function-app.azurewebsites.net/api/*", ["https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.write",
            "https://smarthouseadb2c.onmicrosoft.com/smart-house-api/devices.read"]],
        ])
      },
    ),
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    HttpClientModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
