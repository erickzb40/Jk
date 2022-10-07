import  Swal from 'sweetalert2';

import { EmpleadoModel } from './../../../../models/empleado.interface';
import { NgForm } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {AuthService} from './../../services/auth.service';
import { Local } from 'src/app/models/local.interface';

@Component({
  selector: 'app-empleado-crud',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoCrudComponent implements OnInit {

  local:any=[];
  @Input() empleado: EmpleadoModel = {
    id: null,
    nombre: '',
    num_doc: '',
    tipo_doc: '',
    local: null,
    codigo: null,
    activo:false
  };
  @Input() crud:boolean=false;
  @Output() empleadoUpdate: EventEmitter<NgForm>;
  @Output() empleadoObj:EmpleadoModel=this.empleado;
  constructor(public auth:AuthService) {
    this.empleadoUpdate = new EventEmitter();
  }

  ngOnInit(): void {
    this.auth.getLocales().subscribe((res)=>{
      this.local=res;
    });
  }

  enviar(form: NgForm) {
    if (form.invalid) {
      return;
    }//si el formulario es invalido no hace nada;
    if(!isNaN(form.form.value.codigo)||form.form.value.codigo==undefined){
      this.empleadoUpdate.emit(form);
    }else{
      return Swal.fire({icon:'warning',text:'El codigo debe ser numerico!'});
    }

  }


}
