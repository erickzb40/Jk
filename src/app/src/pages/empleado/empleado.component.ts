import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, finalize } from 'rxjs';
import { AuthService } from '../services/auth.service';

import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {

  now: Date;
  file: File = null;
  fileUrl: any = null;
  codigo = '';
  validar = false;//si no existe el codigo
  title = 'gfgangularwebcam';
  imageName = 'imagen';
  imageFormat = 'image/jpeg';
  modal=false;//abre o cierra el modal
  registro='';//almacena texto si es entrada o salida
  uri: any = null;
  hoy: Date = new Date();
  public webcamImage: WebcamImage | undefined;
  private trigger: Subject<void> = new Subject<void>();

  constructor(public aut: AuthService,private modalService: NgbModal) {
    moment.locale();
  }

  asignar(codigo: string) {
    this.codigo += codigo;
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
  //https://localhost:7195/api/Empleado/file
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    this.now = new Date();

    setInterval(() => {

      this.now = new Date();
    }, 1000);
  }

  entrada(Registro) {
   this.registro=Registro;
   this.modal=true;
   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  }

  marcarEntrada(){
    this.triggerSnapshot();
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.modal=false;
      this.aut.entrada(this.hoy, 'AUTOMATICO', parseInt(this.codigo), this.registro,reader.result ).pipe(finalize(() => { })).subscribe(
        res => { return this.popup(res['fecha'], this.registro); }
      );
    };
  }

  popup(parametroDate, tipo) {
    let fecha = (moment(parametroDate)).format('LTS')
    return Swal.fire({
      icon: 'success',
      title: tipo + ' Registrada!',
      text: '' + fecha
    });
  }




}
