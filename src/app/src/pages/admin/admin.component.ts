import { Asistencia } from './../../../models/asistencia.interface';
import { NgForm,FormsModule } from '@angular/forms';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { finalize} from 'rxjs';
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
    descripcion:'',
    codigo: null
  };
  asistencia:Asistencia={
    id:null,
    fecha :null,
    tipo:null,
    cod_empleado:null,
    identificador:null,
    imagen:null,
    empresa:null
  }
  filterpost:string;
  asistencias: any = [];
  empleados: any = [];
  empleado_p:number=1;
  po: number = 1;
  p: number = 1;

  @Input() empleadoObj:any;
   empleadoObj2:EmpleadoModel = {
    id:null,
    nombre: '',
    num_doc: '',
    tipo_doc: '',
    descripcion:'',
    local: null,
    codigo: null
  };
  @Input() asistenciaObj:Asistencia;

  constructor(public aut: AuthService,
    private domSanitizer: DomSanitizer,
    private excelService:ExcelService
    ) { }

  ngOnInit(): void {
    this.cargarAsistencia();
    this.ListarEmpleado();
  }

  async enviarAsistencia(formulario: NgForm,crud:boolean){
   if(crud){
    this.aut.updateAsistencia(formulario.value).pipe(finalize(() => {
    })).subscribe((res:any)=>{
      Swal.fire({icon:'success',text:'Se actualizó con exito'});
      this.openListaAsistencia();
      formulario.resetForm();
      this.cargarAsistencia();

     },err=>{Swal.fire({icon:'warning',text:'Hubo un error al actualizar'});});
   }
   else{
    this.validarEmpresaLocalStorage();
    this.aut.getEmpleadoCodigoInsert(formulario.value.cod_empleado).subscribe((res:[])=>{
     if (res.length>0) {
      this.aut.crearAsistencia(formulario.value).pipe(finalize(() => {
      })).subscribe((res:any)=>{
        Swal.fire({icon:'success',text:'Se actualizó con exito'});
        this.openListaAsistencia();
        formulario.resetForm();
        this.cargarAsistencia();
       },err=>{Swal.fire({icon:'warning',text:'Hubo un error al actualizar'});});
     } else {
      Swal.fire({icon:'warning',text:'No existe ningun usuario con ese codigo'});
     }
    });

   }
  }
  async enviar(formulario: NgForm,crud:boolean) {
    if (formulario.invalid) { return; }//si el formulario es invalido no hace nada
        if (crud) {
          await this.aut.getEmpleadoCodigo(formulario.value.codigo,formulario.value.id).subscribe(res => {
            if (Object.entries(res).length !== 0) {
              Swal.fire({ icon: 'warning', text: 'Ya existe un empleado con ese codigo!' });
            }else{   this.aut.updateEmpleado(formulario.value).subscribe(res => {
                    console.log(' se actualizo');
                     Swal.fire({ icon: 'success', text: 'Actualizado' });
                     this.ListarEmpleado();
                     this.openListaEmpleado();
                     formulario.resetForm();
                     },err => {Swal.fire({ icon: 'warning', text: 'Hubo un error al actualizar' });return;});
            }})
        } else {await this.aut.getEmpleadoCodigoInsert(formulario.value.codigo).subscribe(res => {
            if (Object.entries(res).length !== 0) {
              Swal.fire({ icon: 'warning', text: 'Ya existe un empleado con ese codigo!' });return;
            }else{  this.aut.insertEmpleado(formulario.value).subscribe(res => {
                    Swal.fire({ icon: 'success', text: 'Registro Creado' });
                    this.ListarEmpleado();
                    this.openListaEmpleado();
                    formulario.resetForm();},
                    err => {Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' });return;});
            }})}
  }

  ListarEmpleado() {
    this.aut.getListaEmpleados(localStorage.getItem("empresa")).pipe(finalize(() => {
    })).subscribe((res: any[]) => {
      this.empleados = res;
    });
  }
  openEdit(empleado: EmpleadoModel) {
    this.empleado = empleado;
    (<HTMLElement>document.getElementsByClassName('actualizar-crud-empleado-btn')[0]).click()
    var elemento = document.getElementById("ucr");
    elemento.className += "active show";
  }
  openEditAsistencia(asistencia:Asistencia){
    this.asistencia=asistencia;
    (<HTMLElement>document.getElementsByClassName('actualizar-crud-asistencia-btn')[0]).click()
    var elemento = document.getElementById("aucr");
    elemento.className += "active show";
  }
   openListaEmpleado(){
    (<HTMLElement>document.getElementsByClassName('listadoEmpleadoCrud')[0]).click()
    var elemento = document.getElementById("lce");
    elemento.className += "active";
  }
  openListaAsistencia(){
    (<HTMLElement>document.getElementsByClassName('listaAsistenciaBtn')[0]).click()
    var elemento = document.getElementById("alce");
    elemento.className += "active";
  }

  mostrarImagen(imagen){
    if (typeof(imagen) != 'undefined') {
      this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' +imagen);
      var img=this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' +imagen);
      return Swal.fire({html:'<img style="max-width:500px" src="'+'data:image/jpg;base64,' +imagen+'">',showConfirmButton:false});
   }else{
      return this.domSanitizer.bypassSecurityTrustUrl('');
   }
  }

  exportToExcel(): void {
    this.excelService.exportAsExcelFile(this.asistencia,'asistencia');
  }
  cargarAsistencia(){
    this.aut.obtenerAsistencia(localStorage.getItem("empresa")).pipe(finalize(() => {
    })).subscribe((res: any[]) => {
      this.asistencias = res;
    });
  }
  validarEmpresaLocalStorage(){
    if(localStorage.getItem('empresa')==null){return Swal.fire({icon:'warning',text:'La empresa no esta asginada, vuelva a logearse'})}
  }
}
