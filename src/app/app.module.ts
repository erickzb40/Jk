import { AuthService } from './src/pages/services/auth.service';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { APP_ROUTING} from './app-routing.module';
import { AppComponent } from './app.component';
import { EmpleadoComponent } from './src/pages/empleado/empleado.component';
import { EmpleadoCrudComponent} from './src/pages/admin/empleado/empleado.component';
import { LoginComponent } from './src/pages/login/login.component';
import { AdminComponent } from './src/pages/admin/admin.component';
import { MenuComponent } from './src/pages/shared/menu/menu.component';
import {WebcamModule} from 'ngx-webcam';
import { HeaderComponent } from './src/pages/admin/header/header.component';
import { FooterComponent } from './src/pages/admin/footer/footer.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { ModalComponent } from './src/pages/shared/modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageNotFoundComponent } from './src/pages/page-not-found/page-not-found.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { ImagenPipe } from './src/pages/shared/pipes/imagen.pipe';
import { ExcelService} from './src/pages/services/export-excel.service';
import { FilterPipe } from './src/pages/shared/pipes/filtrado.pipe';
import { AsistenciaFormComponent } from './src/pages/admin/asistencia-form/asistencia-form.component';

// import {AuthModule} from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    EmpleadoComponent,
    AdminComponent,
    MenuComponent,
    EmpleadoCrudComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ModalComponent,
    PageNotFoundComponent,
    ImagenPipe,
    FilterPipe,
    AsistenciaFormComponent,
      ],
  imports: [
    BrowserModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    APP_ROUTING,
    FormsModule,
    CommonModule,
HttpClientModule,
    WebcamModule,
    NgbModule,
    NoopAnimationsModule
  ],
  providers: [ ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
