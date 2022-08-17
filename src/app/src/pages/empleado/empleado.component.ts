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
  codigo = '';
  validar = false;//si no existe el codigo
  title = 'gfgangularwebcam';
  imageName = 'imagen';
  imageFormat = 'image/jpeg';
  hoy: Date = new Date();
  constructor(public aut: AuthService) {
    moment.locale();
   }

  asignar(codigo: string) {
    this.codigo += codigo;
  }
  clear() {
    this.codigo = '';
  }
  public webcamImage: WebcamImage | undefined;
  private trigger: Subject<void> = new Subject<void>();
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
    const file: File = new File([u8arr], this.imageName, { type: this.imageFormat })
    console.log(file);
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

  entrada() {
    this.triggerSnapshot();
    console.log('entrada');
    this.aut.entrada(this.hoy, 'AUTOMATICO', parseInt(this.codigo), 'ENTRADA').pipe(finalize(() => {})).subscribe(
      res => {
      return this.popup(res['fecha'],'ENTRADA');
      }
    );
  }

  salida() {
    console.log('salida');
     this.aut.entrada(this.hoy, 'AUTOMATICO', parseInt(this.codigo), 'SALIDA').pipe(finalize(() => {})).subscribe(
      res => {
      return this.popup(res['fecha'],'SALIDA');
      }
    );
  }

  popup(parametroDate,tipo){
    let fecha = (moment(parametroDate)).format('LTS')
    return Swal.fire({
      icon: 'success',
      title: tipo+' Registrada!',
      text: ''+fecha
    });
  }

}
