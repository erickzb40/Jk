import Swal from 'sweetalert2';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  loginUrl = 'https://localhost:7195/api/Usuario/login';
  AsistenciaUrl = 'https://localhost:7195/api/Asistencia';
  archivo = 'https://localhost:7195/api/Empleado/file';
  empleadoUrl='https://localhost:7195/api/Empleado/codigoInsert?codigo=';
  private apiUploadUrl: string;
  constructor(private http: HttpClient) {

  }

  login(form: object) {
    return this.http.post(this.loginUrl, form);
  }
  entrada(tipo: string, cod_empleado: Number, identificador: string, uri: any) {
    return this.http.post(this.AsistenciaUrl, this.marcar(tipo, cod_empleado, identificador, uri));
  }

  marcar(tipo: string, cod_empleado: Number, identificador: string, uri: any) {
    var uri:any=this.parseData(uri);
    uri=uri[0][1];
    var pos = uri.search(",");
    var res = uri.substr(pos + 1);
    const val = {
      // "fecha": fecha,
      "tipo": tipo,
      "cod_empleado": cod_empleado,
      "identificador": identificador,
      "imagen": res
    }
    return val;
  }

  obtenerAsistencia(empresa) {
    return this.http.get(this.AsistenciaUrl+"?empresa="+empresa);
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

estaAutenticado():boolean{
  if(localStorage.getItem('token')){return true;}else{return false;}
}
getListaEmpleados(empresa){
 return this.http.get('https://localhost:7195/api/Empleado?empresa='+empresa);
}
updateEmpleado(form:EmpleadoModel){
  return this.http.put('https://localhost:7195/api/Empleado/'+form.id,form);
}
insertEmpleado(form:EmpleadoModel){
  return this.http.post('https://localhost:7195/api/Empleado',form);
}
getEmpeladoCodigo(codigo:any,id:any){
  this.cargando();
return this.http.get('https://localhost:7195/api/Empleado/codigoUpdate?codigo='+codigo+'&id='+id);
}
getEmpeladoCodigoInsert(codigo:any){
  this.cargando();
return this.http.get('https://localhost:7195/api/Empleado/codigoInsert?codigo='+codigo);
}
getLocales(){
  return this.http.get('https://localhost:7195/local');
}


cargando(){
  Swal.fire({
    title: 'Cargando...',
    focusCancel:false,
    allowOutsideClick: false
  });
  Swal.showLoading();
}
}
