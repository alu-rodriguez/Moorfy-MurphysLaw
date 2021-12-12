import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ClientsApiService, GeneralApiService, OwnersApiService, SharedAppsApiService, App1ApiService, App2ApiService} from "./utils/api";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [ClientsApiService, OwnersApiService, GeneralApiService, SharedAppsApiService, App1ApiService, App2ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
