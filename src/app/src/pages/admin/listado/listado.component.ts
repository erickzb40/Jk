import { DomSanitizer } from '@angular/platform-browser';
import { Asistencia } from 'src/app/models/asistencia.interface';
import { NgForm } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {

  constructor(public aut: AuthService,private domSanitizer: DomSanitizer) { }
  asistencias: any = [];
  ip_public='';
  ae=1;
  asistencia= {} as Asistencia;
  filterAsistencia: string='';
  fecha1: string;
  fecha2: string;
  ngOnInit(): void {
    this.cargarAsistencia();
    this.aut.buscarIp().subscribe((res:any)=>{
      this.ip_public=res.ip;
    });
    var fecha = new Date();
    fecha.setDate(fecha.getDate());
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
  }
  cargarAsistencia() {
    Swal.showLoading();
    this.aut.obtenerAsistencia().subscribe((res: any[]) => {
      Swal.close();
      this.asistencias = res;
    },error=>{Swal.close();});
  }
  async enviarAsistencia(formulario: NgForm, crud: boolean) {
    if (formulario.invalid) { return; }
    formulario.value.ip_public=this.ip_public;
    if (crud) {
      this.aut.updateAsistencia(formulario.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', text: 'Se actualizó con éxito' });
        this.openListaAsistencia();
        formulario.resetForm();
        this.cargarAsistencia();
      }, err => { Swal.fire({ icon: 'warning', text: 'Hubo un error al actualizar' }); });
    }
    else {
      this.validarEmpresaLocalStorage();
      this.aut.crearAsistencia(formulario.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', text: 'Se actualizó con éxito' });
        this.openListaAsistencia();
        formulario.resetForm();
        this.cargarAsistencia();
      },
        err => { Swal.fire({ icon: 'warning', text: 'Hubo un error al actualizar' }); }
      );
    }
  }
  openListaAsistencia() {
    (<HTMLElement>document.getElementsByClassName('listaAsistenciaBtn')[0]).click()
    var elemento = document.getElementById("alce");
    elemento.className += "active";
  }
  validarEmpresaLocalStorage() {
    if (localStorage.getItem('token') == null) { return Swal.fire({ icon: 'warning', text: 'La empresa no esta asginada, vuelva a logearse' }) }
  }
  openEditAsistencia(asistencia: Asistencia) {
    this.asistencia = asistencia;
    (<HTMLElement>document.getElementsByClassName('actualizar-crud-asistencia-btn')[0]).click()
    var elemento = document.getElementById("aucr");
    elemento.className += "active show";
  }
  mostrarImagen(imagen) {
    if (typeof (imagen) != 'undefined') {
      this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + imagen);
      var img = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + imagen);
      return Swal.fire({ html: '<img style="max-width:500px" src="' + 'data:image/jpg;base64,' + imagen + '">', showConfirmButton: false });
    } else {
      return this.domSanitizer.bypassSecurityTrustUrl('');
    }
  }
  busquedaAsistenciaRango(){
    this.aut.rangoAsistencia(this.fecha1,this.fecha2).subscribe((res:[])=>{this.asistencias=res})
  }
}
