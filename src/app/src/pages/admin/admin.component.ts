import { FiltrarTablaService } from './../services/filtrar-tabla.service';
import { Asistencia } from 'src/app/models/asistencia.interface';
import { NgForm, FormsModule } from '@angular/forms';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ExcelService } from '../services/export-excel.service';
import Swal from 'sweetalert2';

import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  empleado: EmpleadoModel = {
    nombre: '',
    num_doc: '',
    tipo_doc: '',
    local: null,
    descripcion: '',
    codigo: null
  };
  asistencia= {} as Asistencia;
  // listadoEmpleado = [];//llenar el select con los datos del empleado
  filterpost: string;
  HorasTrabajadas:any=[];//horas trabajadas de asistencia
  asistencias: any = [];
  asistencias2: any = [];
  empleados: any = [];
  empleado_p: number = 1;
  po: number = 1;
  p: number = 1;
  ip_public='';
  @Input() empleadoObj: any;
  empleadoObj2 = {} as EmpleadoModel;
  @Input() asistenciaObj: Asistencia;

  constructor(public aut: AuthService,
    private domSanitizer: DomSanitizer,
    private excelService: ExcelService,
    private FiltrarTabla:FiltrarTablaService
      ) { }

  ngOnInit(): void {
    this.cargarAsistencia();
    this.ListarEmpleado();
    this.aut.buscarIp().subscribe((res:any)=>{
      this.ip_public=res.ip;
    });
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
  // async enviar(formulario: NgForm,crud:boolean) {
  //   if (formulario.invalid) { return; }//si el formulario es invalido no hace nada
  //       if (crud) {
  //         await this.aut.getEmpleadoCodigo(formulario.value.codigo,formulario.value.id).subscribe(res => {
  //           if (Object.entries(res).length !== 0) {
  //             Swal.fire({ icon: 'warning', text: 'Ya existe un empleado con ese codigo!' });
  //           }else{   this.aut.updateEmpleado(formulario.value).subscribe(res => {
  //                   console.log(' se actualizo');
  //                    Swal.fire({ icon: 'success', text: 'Actualizado' });
  //                    this.ListarEmpleado();
  //                    this.openListaEmpleado();
  //                    formulario.resetForm();
  //                    },err => {Swal.fire({ icon: 'warning', text: 'Hubo un error al actualizar' });return;});
  //           }})
  //       } else {await this.aut.getEmpleadoCodigoInsert(formulario.value.codigo).subscribe(res => {
  //           if (Object.entries(res).length !== 0) {
  //             Swal.fire({ icon: 'warning', text: 'Ya existe un empleado con ese codigo!' });return;
  //           }else{  this.aut.insertEmpleado(formulario.value).subscribe(res => {
  //                   Swal.fire({ icon: 'success', text: 'Registro Creado' });
  //                   this.ListarEmpleado();
  //                   this.openListaEmpleado();
  //                   formulario.resetForm();},
  //                   err => {Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' });return;});
  //           }})}
  // }
  async enviar(formulario: NgForm, crud: boolean) {
    if (formulario.invalid) { return; }//si el formulario es invalido no hace nada
    if (crud) {
      this.aut.updateEmpleado(formulario.value).subscribe(res => {
        this.openListaEmpleado();
        return this.finUpdate(formulario, 'Actualizado con éxito');
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      });
    } else {
      this.aut.insertEmpleado(formulario.value).subscribe(res => {
        this.openListaEmpleado();
        return this.finUpdate(formulario, 'Creado con éxito');
      },
        err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
        })
    }
  }
  //parte del codigo final de insertar y actualizar
  public finUpdate(formulario, res) {
    this.ListarEmpleado();
    formulario.resetForm();
    Swal.fire({ icon: 'success', text: res });
  }
  ListarEmpleado() {
    this.aut.getListaEmpleados().subscribe((res: any[]) => {
      this.empleados = res;
    });
  }
  openEdit(empleado: EmpleadoModel) {
    this.empleado = empleado;
    (<HTMLElement>document.getElementsByClassName('actualizar-crud-empleado-btn')[0]).click()
    var elemento = document.getElementById("ucr");
    elemento.className += "active show";
  }
  openEditAsistencia(asistencia: Asistencia) {
    this.asistencia = asistencia;
    (<HTMLElement>document.getElementsByClassName('actualizar-crud-asistencia-btn')[0]).click()
    var elemento = document.getElementById("aucr");
    elemento.className += "active show";
  }
  openListaEmpleado() {
    (<HTMLElement>document.getElementsByClassName('listadoEmpleadoCrud')[0]).click()
    var elemento = document.getElementById("lce");
    elemento.className += "active";
  }
  openListaAsistencia() {
    (<HTMLElement>document.getElementsByClassName('listaAsistenciaBtn')[0]).click()
    var elemento = document.getElementById("alce");
    elemento.className += "active";
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

  exportToExcel(): void {
    var reporte=this.FiltrarTabla.filtrarHorasEmpleado(this.asistencias);
    this.excelService.exportAsExcelFile(reporte, 'reporte');
  }
  cargarAsistencia() {
    this.aut.obtenerAsistencia().subscribe((res: any[]) => {
      this.asistencias = res;
      this.asistencias2 = res;
    });
  }
  validarEmpresaLocalStorage() {
    if (localStorage.getItem('token') == null) { return Swal.fire({ icon: 'warning', text: 'La empresa no esta asginada, vuelva a logearse' }) }
  }
}
