import { UsuarioModel } from './../../../models/usuario.interface';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http:HttpClient) {
  }

  login(form: UsuarioModel){

  return this.http.post('https://localhost:7085/api/Usuarios/login',form);
  }
}
