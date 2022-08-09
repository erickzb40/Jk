import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmpleadoComponent } from './src/pages/empleado/empleado.component';
import { LoginComponent } from './src/pages/login/login.component';
import { AdminComponent } from './src/pages/admin/admin.component';
import { MenuComponent } from './src/pages/shared/menu/menu.component';
import {WebcamModule} from 'ngx-webcam';

@NgModule({
  declarations: [
    AppComponent,
    EmpleadoComponent,
    LoginComponent,
    AdminComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
