import Swal from 'sweetalert2';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})

export class AuthService {
  localhost='http://192.168.0.8:9091/';
  loginUrl = this.localhost+'api/Usuario/login';
  AsistenciaUrl = this.localhost+'api/Asistencia';
  archivo = this.localhost+'api/Empleado/file';
  empleadoUrl=this.localhost+'api/Empleado/codigoInsert?codigo=';
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
    var empresa=localStorage.getItem('empresa')?localStorage.getItem('empresa'):0;
    var uri:any=this.parseData(uri);
    uri=uri[0][1];
    var pos = uri.search(",");
    var res = uri.substr(pos + 1);
    const val = {
      // "fecha": fecha,
      "tipo": tipo,
      "cod_empleado": cod_empleado,
      "identificador": identificador,
      "imagen": res,
      "empresa":empresa
    }
    return val;
  }

  obtenerAsistencia(empresa) {
    return this.http.get(this.AsistenciaUrl+"?empresa="+empresa);
  }
  getEmpleado(codigo:string){
    var empresa= "&empresa="+localStorage.getItem('empresa');
    return this.http.get(this.empleadoUrl+codigo+empresa);
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
 return this.http.get(this.localhost+'api/Empleado?empresa='+empresa);
}
updateEmpleado(form:EmpleadoModel){
  return this.http.post(this.localhost+'api/Empleado/'+form.id,form);
}
insertEmpleado(form:EmpleadoModel){
  return this.http.post(this.localhost+'api/Empleado',form);
}
getEmpleadoCodigo(codigo:any,id:any){
  this.cargando();
var empresaStorage=localStorage.getItem('empresa');
return this.http.get(this.localhost+'api/Empleado/codigoUpdate?codigo='+codigo+'&id='+id+'&empresa='+empresaStorage);
}
getEmpleadoCodigoInsert(codigo:any){
  this.cargando();
 var empresaStorage=localStorage.getItem('empresa');
return this.http.get(this.localhost+'api/Empleado/codigoInsert?codigo='+codigo+'&empresa='+empresaStorage);
}
getLocales(empresa){
  return this.http.get(this.localhost+'local?empresa='+empresa);
}

updateAsistencia(form:any){
  form.tipo='MANUAL';
  return this.http.post(this.localhost+'api/Asistencia/update?id='+form.id,form);
}
crearAsistencia(form:any){
  form.empresa=localStorage.getItem('empresa');
  form.tipo='MANUAL';
  return this.http.post(this.localhost+'api/Asistencia',form);
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
