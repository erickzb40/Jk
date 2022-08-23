
import { EmpleadoModel } from './../../../../models/empleado.interface';
import { NgForm } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-empleado-crud',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoCrudComponent implements OnInit {

  @Input() empleado: EmpleadoModel = {
    id: null,
    nombre: '',
    num_doc: '',
    tipo_doc: '',
    local: null,
    codigo: null
  };
  @Input() crud:boolean=false;
  @Output() empleadoUpdate: EventEmitter<NgForm>;
  @Output() empleadoObj:EmpleadoModel=this.empleado;
  constructor() {
    this.empleadoUpdate = new EventEmitter();
  }

  ngOnInit(): void {
  }

  enviar(form: NgForm) {
    if (form.invalid) {
      return;
    }//si el formulario es invalido no hace nada;
     this.empleadoUpdate.emit(form);

  }

}
