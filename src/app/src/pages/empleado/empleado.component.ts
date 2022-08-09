import { Component, OnInit } from '@angular/core';
import {WebcamImage} from 'ngx-webcam';
import {Subject, Observable} from 'rxjs';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent{
codigo='';
validar=true;
title = 'gfgangularwebcam';
imageName = 'imagen';
imageFormat= 'image/jpeg';
constructor() { }

   asignar(codigo:string){
    this.codigo+=codigo;
  }
   clear(){
    this.codigo='';
   }
  public webcamImage: WebcamImage | undefined;
  private trigger: Subject<void> = new Subject<void>();
  triggerSnapshot(): void {
   this.trigger.next();
   this.validar=false;
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

  public get triggerObservable(): Observable<void> {
   return this.trigger.asObservable();
  }



}
