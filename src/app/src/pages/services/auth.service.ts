import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = 'https://localhost:7195/api/Usuario/login';
  AsistenciaUrl = 'https://localhost:7195/api/Asistencia';
  constructor(private http: HttpClient) {
  }

  login(form: object) {
    return this.http.post(this.loginUrl, form);
  }
  entrada(fecha: Date, tipo: string, cod_empleado:Number,identificador:string) {
    return this.http.post(this.AsistenciaUrl,this.marcar(fecha,tipo,cod_empleado,identificador));
  }
  salida(fecha: Date, tipo: string, cod_empleado:Number,identificador:string) {
    return this.http.post(this.AsistenciaUrl, this.marcar(fecha,tipo,cod_empleado,identificador));
  }
  marcar(fecha: Date, tipo: string, cod_empleado:Number,identificador:string) {
   const val= {
      "fecha": fecha,
      "tipo":  tipo,
      "cod_empleado": cod_empleado,
      "identificador": identificador}
      return val;
  }
  obtenerAsistencia(){
    return this.http.get(this.AsistenciaUrl);
  }
}
