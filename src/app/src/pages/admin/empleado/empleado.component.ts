
import { EmpleadoModel } from './../../../../models/empleado.interface';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-empleado-crud',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoCrudComponent implements OnInit {

  empleado:EmpleadoModel={
    nombre:'',
    num_doc:'',
    tipo_doc:'',
    area:null,
    codigo:null
  };
constructor() {
}


  ngOnInit(): void {
  }

  insertar(form:NgForm){
   if (form.invalid) { return; }//si el formulario es invalido no hace nada
   console.log(form.value);

  }
  update(form:NgForm){
    if (form.invalid) { return; }//si el formulario es invalido no hace nada
   console.log(form.value);
  }

}
