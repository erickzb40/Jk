import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltrarTablaService {

  constructor() {

  }

  filtrarHorasEmpleado(list) {
    list = this.ordenarPorId(list);
    var lista = this.ordenarEmpleadoFecha(list);
    var listaFinal = [];
    for (let l = 0; l < lista.length; l++) {
      listaFinal.push({ nombre: lista[l].nombre });
      for (let index = 1; index <= 31; index++) {
        listaFinal[l]['dia' + index] = this.extraerHoraDia(lista[l], index);
      }
    }
    return listaFinal;
  }
  ordenarPorId(list: any) {
    var lista = [];
    list.forEach(element => {
      // _.omit(element, [ 'nombre' ])
      const { imagen, ...b } = element;
      var i = b;
      lista.push(i);
    });
    lista = list.sort(function (a, b) {
      if (a.id < b.id)
        return -1;
      if (a.campoString > b.campoString)
        return 1;
      return 0;
    })
    return lista;
  }
  extraerHoraDia(element, dia: number) {
    var ENTRADA = 0;
    var SALIDA = 0;
    var HORAS = 0;
    for (let index = 0; index < element.asistencia.length; index++) {
      var fecha = new Date(element.asistencia[index].fecha);
      var identificador = element.asistencia[index].identificador;
      if (fecha.getDate() == dia) {//filtra por dia
        if(index==0&&identificador=='ENTRADA'){//validar si el primer marcador es entrada
          ENTRADA=fecha.getTime();
        }
        if(index>0&&identificador=='SALIDA'&&ENTRADA!=0){
          SALIDA=fecha.getTime();
          HORAS=HORAS+SALIDA-ENTRADA;
          SALIDA=0;
          ENTRADA=0;
        }
      }
    }
    return this.convertirMiliHora(HORAS);
  }
  convertirMiliHora(s) {
    if(s==0){return ''}
      function addZ(n) {
        return (n < 10 ? '0' : '') + n;
      }
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;
      return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);
  }
  ordenarEmpleadoFecha(list: any) {
    var empleados = [];
    var fecha = [];
    const busqueda = list.reduce((acc, persona) => {
      acc[persona.nombre] = ++acc[persona.nombre] || 0;
      return acc;
    }, {});
    let empNombre = Object.keys(busqueda);
    empNombre.forEach(nombre => {
      fecha = [];
      list.forEach(element => {
        if (element.nombre == nombre) {
          fecha.push({ fecha: element.fecha, identificador: element.identificador });
        }
      });
      console.log()
      empleados.push({ nombre: nombre, asistencia: fecha });
    });
    return empleados;
  }
}
