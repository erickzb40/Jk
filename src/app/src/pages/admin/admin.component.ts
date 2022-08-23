import { NgForm } from '@angular/forms';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { finalize} from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as XLSX from 'xlsx';//exportar a excel
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
    codigo: null
  };
  asistencia: any = [];
  empleados: any = [];
  po: number = 1;
  p: number = 1;

  @Input() empleadoObj:any;
   empleadoObj2:EmpleadoModel = {
    id:null,
    nombre: '',
    num_doc: '',
    tipo_doc: '',
    local: null,
    codigo: null
  };

  constructor(public aut: AuthService,private domSanitizer: DomSanitizer,public _DomSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.aut.obtenerAsistencia().pipe(finalize(() => {
    })).subscribe((res: any[]) => {
      this.asistencia = res;
      console.log(res);
    });
  }

  //
  async enviar(formulario: NgForm,crud:boolean) {
    if (formulario.invalid) { return; }//si el formulario es invalido no hace nada
        if (crud) {
          console.log('actualizar');
          await this.aut.getEmpeladoCodigo(formulario.value.codigo,formulario.value.id).subscribe(res => {
            if (Object.entries(res).length !== 0) {
              Swal.fire({ icon: 'warning', text: 'Ya existe un empleado con ese codigo!' });
              return console.log('se detubo actualizar');
            }else{
              this.aut.updateEmpleado(formulario.value).subscribe(res => {
                Swal.fire({ icon: 'success', text: 'Actualizado' });
               formulario.resetForm();
              },
                err => {
                  Swal.fire({ icon: 'warning', text: 'Hubo un error al actualizar' });
                  return;
                }
              );
            }
          })
        } else {
          await this.aut.getEmpeladoCodigoInsert(formulario.value.codigo).subscribe(res => {
            if (Object.entries(res).length !== 0) {
              console.log(Object.entries(res).length);
              Swal.fire({ icon: 'warning', text: 'Ya existe un empleado con ese codigo!' });
              return ;
            }else{
              this.aut.insertEmpleado(formulario.value).subscribe(res => {
                Swal.fire({ icon: 'success', text: 'Registro Creado' });
                formulario.resetForm();
              }, err => {
                Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' });
                return;
              });
            }
          })
        }
  }

  ListarEmpleado() {
    this.aut.getListaEmpleados().pipe(finalize(() => {
    })).subscribe((res: any[]) => {
      this.empleados = res;
    });
  }
  openEdit(empleado: EmpleadoModel) {
    this.empleado = empleado;
    console.log(this.empleado);
    (<HTMLElement>document.getElementsByClassName('actualizar-crud-empleado-btn')[0]).click()
    var elemento = document.getElementById("update-crud-ref");
    elemento.className += " active";
  }
  name = 'ExcelSheet.xlsx';
  exportToExcel(): void {
    let element = document.getElementById('asistencia-excel');
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');
    XLSX.writeFile(book, this.name);
  }
  mostrarImagen(img){

  }
}
