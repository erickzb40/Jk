import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  loginUrl = 'https://localhost:7195/api/Usuario/login';
  AsistenciaUrl = 'https://localhost:7195/api/Asistencia';
  archivo = 'https://localhost:7195/api/Empleado/file';
  empleadoUrl='https://localhost:7195/api/Empleado/codigo?codigo=';
  private apiUploadUrl: string;
  constructor(private http: HttpClient) {

  }

  login(form: object) {
    return this.http.post(this.loginUrl, form);
  }
  entrada(fecha: Date, tipo: string, cod_empleado: Number, identificador: string, uri: any) {
    return this.http.post(this.AsistenciaUrl, this.marcar(fecha, tipo, cod_empleado, identificador, uri));
  }

  marcar(fecha: Date, tipo: string, cod_empleado: Number, identificador: string, uri: any) {

    var uri:any=this.parseData(uri);
    uri=uri[0][1];
    var pos = uri.search(",");
    var res = uri.substr(pos + 1);
    const val = {
      "fecha": fecha,
      "tipo": tipo,
      "cod_empleado": cod_empleado,
      "identificador": identificador,
      "imagen": res
    }
    return val;
  }

  obtenerAsistencia() {
    return this.http.get(this.AsistenciaUrl);
  }
  getEmpleado(codigo:string){
    return this.http.get(this.empleadoUrl+codigo);
  }
  parseData(data: string | ArrayBuffer | null){
    var dummyArr: string[][] = []
    var eachLine = data?.toString().split('\n');
    eachLine?.forEach((line: string) => {
      let arr = []
      let str = ""
      for(var i = 0; i < line.length; i++){
        if(line[i] == ';'){
          arr.push(str)
          str = ""
        }else{
          str += line[i]
        }
      }
      arr.push(str)
      dummyArr.push(arr)
    })
    return dummyArr;
  }


}
