import Swal from 'sweetalert2';
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
  @Input() asistencia= {} as Asistencia;
  @Input() crud:boolean=false;
  @Output() AsistenciaUpdate: EventEmitter<NgForm>;
  @Output() asistenciaObj:Asistencia=this.asistencia;

  ngOnInit(): void {
  }
  enviar(form: NgForm) {
    if (form.invalid) {
      return;
    }//si el formulario es invalido no hace nada;

     if(!isNaN(form.form.value.codigo)||form.form.value.codigo==undefined){
      this.AsistenciaUpdate.emit(form);
    }else{
      return Swal.fire({icon:'warning',text:'El codigo debe ser numerico!'});
    }
  }
}
