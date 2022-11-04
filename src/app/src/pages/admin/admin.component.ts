import { Asistencia } from 'src/app/models/asistencia.interface';
import { NgForm, FormsModule } from '@angular/forms';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ExcelService } from '../services/export-excel.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
  // listadoEmpleado = [];//llenar el select con los datos del empleado
  closeResult = '';//viene del modal
  filterpost: string='';
  HorasTrabajadas:any=[];//horas trabajadas de asistencia
  asistenciaEmpleado: any = [];
  empleados: any = [];
  empleado_p: number = 1;
  po: number = 1;
  p: number = 1;
  ae:number=1;
  fecha1: string;
  fecha2: string;
  fecha1Asistencia: string;
  fecha2Asistencia: string;
  id_empleado:string;//dato para obtener asistencia del empleado
  @Input() empleadoObj: any;
  empleadoObj2 = {} as EmpleadoModel;
  @Input() asistenciaObj: Asistencia;

  constructor(public aut: AuthService,
    private domSanitizer: DomSanitizer,
    private excelService: ExcelService,
    private modalService: NgbModal
      ) { }

  ngOnInit(): void {
    var fecha = new Date();
    fecha.setDate(fecha.getDate());
    this.fecha1 = fecha.toJSON().slice(0, 10);
    this.fecha2 = fecha.toJSON().slice(0, 10);
    this.fecha1Asistencia = fecha.toJSON().slice(0, 10);
    this.fecha2Asistencia = fecha.toJSON().slice(0, 10);

    this.ListarEmpleado();
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

  openListaEmpleado() {
    (<HTMLElement>document.getElementsByClassName('listadoEmpleadoCrud')[0]).click()
    var elemento = document.getElementById("lce");
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





  openReport(content,id_empleado){
    this.id_empleado=id_empleado;
    this.asistenciaEmpleado=[];
    this.busquedaAsistenciaEmpleado();
    this.modalService.open(content,{ size: 'lg', backdrop: 'static' }).result.then((result) => {
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
  busquedaAsistenciaEmpleado(){
    this.aut.getAsistenciaEmpleado(this.fecha1,this.fecha2,this.id_empleado).subscribe((res:[])=>{
      this.asistenciaEmpleado=res;
    })
  }
  reporteEmpleado(){
    this.excelService.exportAsExcelFile(this.asistenciaEmpleado, 'Reporte Empleado');
  }
}
