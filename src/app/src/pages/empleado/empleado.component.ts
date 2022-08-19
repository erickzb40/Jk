import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, finalize } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';


import Swal from 'sweetalert2';
import * as moment from 'moment';
@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {
  closeResult = '';//viene del modal
  now: Date;
  file: File = null;
  img64:any=null;
  fileUrl: any = null;
  codigo = '';
  validar = false;//si no existe el codigo
  title = 'gfgangularwebcam';
  imageName = 'imagen';
  imageFormat = 'image/jpeg';
  registro='';//almacena texto si es entrada o salida

  nombreEmpleado='';
  num_doc='';
  uri: any = null;
  hoy: Date = new Date();
  public confirmar=false;
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

  marcarEntrada(){
    this.aut.entrada(this.hoy, 'AUTOMATICO', parseInt(this.codigo), this.registro,this.img64).pipe(finalize(() => { })).subscribe(
      res => {
        this.codigo='';
        return this.popup(res['fecha'], this.registro); }
    );
  }

  popup(parametroDate, tipo) {
    let fecha = (moment(parametroDate)).format('LTS')
    return Swal.fire({
      icon: 'success',
      title: tipo + ' Registrada!',
      text: '' + fecha
    });
  }

  open(content,registro) {
    this.aut.getEmpleado(this.codigo).subscribe(res=>{
      this.nombreEmpleado=res[0].nombre;
      this.num_doc=res[0].num_doc;
    });
    this.triggerSnapshot();
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.img64=reader.result;
    };
    this.registro=registro;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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


}
