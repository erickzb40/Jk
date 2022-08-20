import { NgForm } from '@angular/forms';
import { EmpleadoModel } from './../../../models/empleado.interface';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  empleado:EmpleadoModel={
    nombre:'',
    num_doc:'',
    tipo_doc:'',
    area:null,
    codigo:null
  };
  asistencia : any=[];
  empleados:any=[];
  p: number = 1;
  constructor(public aut:AuthService) { }

  ngOnInit(): void {
  this.aut.obtenerAsistencia().pipe(finalize(()=>{
  })).subscribe((res:any[])=>{
    this.asistencia=res;
    console.log(res);
  });
  }

  insertar(form:NgForm){
    if (form.invalid) { return; }//si el formulario es invalido no hace nada
    console.log(form.value);

   }
   update(form:NgForm){
     if (form.invalid) { return; }//si el formulario es invalido no hace nada
    console.log(form.value);
   }

   ListarEmpleado(){
    this.aut.getListaEmpleados().pipe(finalize(()=>{
    })).subscribe((res:any[])=>{
      this.empleados=res;
    });
   }

}
