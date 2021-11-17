import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ClientsApiService, GeneralApiService, OwnersApiService} from "./utils/api";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
  providers: [ClientsApiService, OwnersApiService, GeneralApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
