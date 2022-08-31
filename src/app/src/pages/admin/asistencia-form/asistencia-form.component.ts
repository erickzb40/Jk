import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Asistencia } from 'src/app/models/asistencia.interface';

@Component({
  selector: 'app-asistencia-form',
  templateUrl: './asistencia-form.component.html',
  styleUrls: ['./asistencia-form.component.css']
})
export class AsistenciaFormComponent implements OnInit {

  constructor() {
    this.AsistenciaUpdate = new EventEmitter();
   }
  @Input() asistencia: Asistencia = {
    id :null,
    fecha :null,
    tipo:'',
    cod_empleado:null,
    identificador:'',
    imagen:null,
    empresa:null
  };
  @Input() crud:boolean=false;
  @Output() AsistenciaUpdate: EventEmitter<NgForm>;
  @Output() asistenciaObj:Asistencia=this.asistencia;

  ngOnInit(): void {
  }
  enviar(form: NgForm) {
    if (form.invalid) {
      return;
    }//si el formulario es invalido no hace nada;
     this.AsistenciaUpdate.emit(form);
  }
}
