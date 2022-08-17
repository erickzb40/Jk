import { LoginComponent } from './src/pages/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadoComponent} from './src/pages/empleado/empleado.component';
import { AdminComponent} from './src/pages/admin/admin.component';

const APP_ROUTES: Routes = [
  {path:'login',component:LoginComponent},
  {path:'empleado',component:EmpleadoComponent},
  {path:'admin',component:AdminComponent},
  {path: '', pathMatch: 'full', redirectTo: 'login'}
];
export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
