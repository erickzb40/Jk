import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, finalize } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';


import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  token = localStorage.getItem('token');

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

  nombreEmpleado = '';
  num_doc = '';

  validacionInput = false;
  uri: any = null;
  hoy: Date = null;
  public confirmar = false;
  public webcamImage: WebcamImage | undefined;
  private trigger: Subject<void> = new Subject<void>();

  constructor(public aut: AuthService, private modalService: NgbModal, public rout: Router) {
    moment.locale();
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
    this.aut.entrada(this.hoy, 'AUTOMATICO', parseInt(this.codigo), this.registro, this.img64).pipe(finalize(() => { })).subscribe(
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
    this.validarInput();
    Swal.fire({
      title: 'Cargando...',
      focusCancel: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.aut.getEmpleado(this.codigo).subscribe(res => {
      if (Object.entries(res).length !== 0) {
        Swal.close();
        this.nombreEmpleado = res[0].nombre;
        this.num_doc = res[0].num_doc;
        this.hoy = new Date();
        this.triggerSnapshot();
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.img64 = reader.result;
        };
        this.registro = registro;
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
   salir(){
  localStorage.removeItem('token');
  this.token=null;
   }
}
