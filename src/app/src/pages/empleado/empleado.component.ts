import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, finalize } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';


import Swal from 'sweetalert2';
import * as moment from 'moment';
import { round } from 'lodash';
@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  token = localStorage.getItem('access');

  closeResult = '';//viene del modal
  now: Date;
  file: File = null;
  img64: any = null;
  fileUrl: any = null;
  codigo = '';
  validar = false;//si no existe el codigo
  title = 'gfgangularwebcam';
  imageName = 'imagen';
  imageFormat = 'image/jpeg';
  registro = '';//almacena texto si es entrada o salida
  hoy = new Date;
  nombreEmpleado = '';
  num_doc = '';
  ip_public = '';
  validacionInput = false;
  uri: any = null;
  public confirmar = false;
  public webcamImage: WebcamImage | undefined;
  private trigger: Subject<void> = new Subject<void>();


/*   list: any[] = [
    { "fecha": "2022-10-01T20:30:00", "identificador": "ENTRADA", "nombre": "erickass" },
    { "fecha": "2022-10-01T22:40:00", "identificador": "SALIDA", "nombre": "erickass" },
    { "fecha": "2022-10-01T23:30:00", "identificador": "ENTRADA", "nombre": "erickass" },
    { "fecha": "2022-10-01T23:40:00", "identificador": "SALIDA", "nombre": "erick" },
    { "fecha": "2022-10-01T20:30:00", "identificador": "ENTRADA", "nombre": "erickass" },
    { "fecha": "2022-10-01T22:30:00", "identificador": "SALIDA", "nombre": "erickass" },
    { "fecha": "2022-10-01T20:30:00", "identificador": "ENTRADA", "nombre": "erick" },
    { "fecha": "2022-10-01T23:30:00", "identificador": "SALIDA", "nombre": "erick" },
    { "fecha": "2022-10-01T20:30:00", "identificador": "ENTRADA", "nombre": "erickass" },
  ] */

  constructor(public aut: AuthService, private modalService: NgbModal, public rout: Router) {
   /*  var lista=this.ordenarEmpleadoFecha(this.list);
    var listaFinal=[];
    lista.forEach(element => {
      listaFinal.push({nombre:element.nombre});
      for (let index = 1; index <= 31; index++) {
      var horas=this.extraerHoraDia(element,index);
      Object.defineProperty(listaFinal[0], 'dia '+index, {value:(horas / (1000 * 60 * 60)).toFixed(1)})
    }});
    console.log(listaFinal); */
    aut.buscarIp().subscribe((res: any) => {
      this.ip_public = res.ip;
    });
    moment.locale();
  }
  extraerHoraDia(element,dia:Number){
    var ENTRADA=0;
    var SALIDA=0;
    for (let index = 0; index < element.asistencia.length; index++) {
     if(element.asistencia[index].identificador=='ENTRADA'&&element.asistencia.length-1>index&&new Date(element.asistencia[index].fecha).getDate()==dia){
      ENTRADA=ENTRADA+new Date(element.asistencia[index].fecha).getTime();
     }
     if(element.asistencia[index].identificador=='SALIDA'&&index>=1&&new Date(element.asistencia[index].fecha).getDate()==dia){
          SALIDA=SALIDA+new Date(element.asistencia[index].fecha).getTime();
        }
    }
    var horas= Math.abs(SALIDA-ENTRADA);
    return horas;
  }
  ordenarEmpleadoFecha(list:any) {
    var empleados = [];
    var fecha = [];
    const busqueda = list.reduce((acc, persona) => {
      acc[persona.nombre] = ++acc[persona.nombre] || 0;
      return acc;
    }, {});
    let empNombre = Object.keys(busqueda);
    empNombre.forEach(nombre => {
      fecha = [];
      list.forEach(element => {
        if (element.nombre == nombre) {
          fecha.push({ fecha: element.fecha ,identificador:element.identificador});
        }});
      empleados.push({ nombre: nombre, asistencia: fecha });
    });
    return empleados;
  }
  asignar(codigo: string) {
    this.codigo += codigo;
    this.validarInput();
  }
  clear() {
    this.codigo = '';
  }


  triggerSnapshot(): void {
    this.trigger.next();
    this.validar = false;

  }
  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    const arr = this.webcamImage.imageAsDataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file = new File([u8arr], this.imageName, { type: this.imageFormat })
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    this.now = new Date();

    setInterval(() => {

      this.now = new Date();
    }, 1000);
  }

  marcarEntrada() {
    Swal.fire({
      title: 'Cargando...',
      focusCancel: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.aut.entrada('AUTOMATICO', parseInt(this.codigo), this.registro, this.img64, this.ip_public).subscribe(
      res => {
        this.codigo = '';
        return this.popup(res['fecha'], this.registro);
      },
      err => {
        Swal.fire({ icon: 'warning', text: 'hubo un error en la conexion al servidor' });
      }
    );
  }

  popup(parametroDate, tipo) {
    let fecha = (moment(parametroDate)).format('LTS')
    return Swal.fire({
      icon: 'success',
      title: ' Registrado!',
    });
  }

  open(content, registro) {
    if (this.validarLocalStorage()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Mensaje',
        text: 'La empresa no ha sido asignada, debe logearse para realizar la configuración'
      });
    }
    this.validarInput();
    Swal.fire({
      title: 'Cargando...',
      focusCancel: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.aut.getEmpleado(this.codigo).subscribe((res: any) => {
      if (Object.entries(res).length !== 0) {
        Swal.close();
        this.nombreEmpleado = res.nombre;
        this.num_doc = res.num_doc;
        this.triggerSnapshot();
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.img64 = reader.result;
        };
        this.registro = registro;
        if (this.file.size < 3000) {
          return Swal.fire({
            icon: 'warning',
            title: 'Mensaje',
            text: 'Hay problemas con la camara, Habilitelo y reinicie la pagina'
          });
        }
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }
      else {
        this.nombreEmpleado = '';
        this.num_doc = '';
        Swal.fire({ icon: 'warning', text: 'No se encontro ningun empleado con ese codigo' });
      }
    }, err => {
      Swal.fire({ icon: 'warning', text: 'hubo un error en la conexion al servidor' });
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  validarInput() {
    if (this.codigo.length == 0) {
      this.validacionInput = true;
    } else {
      this.validacionInput = false;
    }
  }

  login() {
    this.rout.navigateByUrl('/login');
  }
  salir() {
    localStorage.removeItem('access');
    this.token = null;
  }
  validarLocalStorage() {
    if (localStorage.getItem('token') == null) {
      return true
    } else { return false }
  }
}
