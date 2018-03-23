import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatNativeDateModule, MatToolbarModule, MatToolbar, MatSnackBarModule, MatIconModule, MatIcon, MatDialogModule, MatCardModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';


import {MatFormFieldModule} from '@angular/material/form-field';

import { EsriMapComponent } from './esri-map/esri-map.component';


import { AppComponent } from './app.component';
import { PermitFormComponent } from './permit-form/permit-form.component';
import { AttachmentsService } from './attachments.service';


@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    PermitFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatOptionModule, 
    MatRadioModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    HttpClientModule,
    MatToolbarModule,
    MatSnackBarModule, 
    MatIconModule,
    MatDialogModule,
    MatCardModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'en-US'}, AttachmentsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
