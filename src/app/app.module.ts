import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APP_ROUTING} from './app-routing.module';
import { AppComponent } from './app.component';
import { EmpleadoComponent } from './src/pages/empleado/empleado.component';
import { LoginComponent } from './src/pages/login/login.component';
import { AdminComponent } from './src/pages/admin/admin.component';
import { MenuComponent } from './src/pages/shared/menu/menu.component';
import {WebcamModule} from 'ngx-webcam';
import { HeaderComponent } from './src/pages/admin/header/header.component';
import { FooterComponent } from './src/pages/admin/footer/footer.component';
import {NgxPaginationModule} from 'ngx-pagination';


// import {AuthModule} from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    EmpleadoComponent,
    AdminComponent,
    MenuComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
      ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    APP_ROUTING,
    FormsModule,
    CommonModule,
HttpClientModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
