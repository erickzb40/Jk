import { Injectable } from '@angular/core';
import { ExcelService } from './export-excel.service';

@Injectable({
  providedIn: 'root'
})
export class FiltrarTablaService {

  constructor(private excelService: ExcelService) {

  }

  filtrarHorasEmpleado(list) {
    var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    list = this.ordenarPorFecha(list);
    var lista = this.ordenarEmpleadoFecha(list);
    var listaFinal = [];
    for (let l = 0; l < lista.length; l++) {
      var Total = 0;
      listaFinal.push({ Nombre: lista[l].nombre });
      listaFinal[l]['Codigo'] = lista[l].codigo;
      listaFinal[l]['Año'] = new Date(list[0].fecha).getFullYear();
      listaFinal[l]['Mes'] = meses[new Date(list[0].fecha).getMonth()];
      for (let index = 1; index <= 31; index++) {
        var horas = this.extraerHoraDia(lista[l], index);
        listaFinal[l]['dia' + index] = this.convertirMiliHora(horas);
        Total = Total + horas;
      }
      if (Total > 0) {
        listaFinal[l]['Total'] = this.convertirMiliHora(Total);
      } else {
        listaFinal[l]['Total'] = '';
      }

    }
    return listaFinal;
  }
  ordenarPorFecha(list: any) {
    var lista = [];
    list.forEach(element => {
      const { imagen, ...b } = element;
      var i = b;
      lista.push(i);
    });
    lista = list.sort(function (a, b) {
      if (a.fecha < b.fecha)
        return -1;
      if (a.fecha > b.fecha)
        return 1;
      return 0;
    })
    return lista;
  }
  extraerHoraDia(element, dia: number) {//asistencias de un empleado
    var ENTRADA = 0;
    var SALIDA = 0;
    var HORAS = 0;
    for (let index = 0; index < element.asistencia.length; index++) {//array de asistencias del empleado
      var fecha = new Date(element.asistencia[index].fecha);
      var identificador = element.asistencia[index].identificador;
      if (fecha.getDate() == dia) {//filtra por dia
        if (identificador == 'ENTRADA') {
          ENTRADA = fecha.getTime();
        }
        //VALIDO SI NO ES EL ULTIMO REGISTRO PARA EVITAR ERRORES
        if (element.asistencia.length - 1 != index) {
          //VALIDO SI EL REGISTRO ACTUAL ES SALIDA Y AUN NO SE HA HECHO LA SUMA DE HORAS
          //VALIDO SI EL REGISTRO DESPUES DE ESTE TIENE SALIDA PARA CONSIDERAR ESE Y NO ESTE
          if (identificador == 'SALIDA' && ENTRADA != 0 && SALIDA == 0 && element.asistencia[index + 1].identificador != 'SALIDA' && (element.asistencia[index + 1].fecha == dia)) {
            SALIDA = fecha.getTime();
            HORAS = HORAS + SALIDA - ENTRADA;
            SALIDA = 0;
            ENTRADA = 0;
          } else if (identificador == 'SALIDA' && ENTRADA != 0 && SALIDA == 0) {
            SALIDA = fecha.getTime();
            HORAS = HORAS + SALIDA - ENTRADA;
            SALIDA = 0;
            ENTRADA = 0;
          }
          //VALIDAMOS SI EL DIA TERMINA CON UNA ENTRADA Y TIENE UNA SALIDA EN EL DIA SIGUIENTE
          if (identificador == 'ENTRADA' && new Date(element.asistencia[index + 1].fecha).getDate() == (dia + 1) && element.asistencia[index + 1].identificador != 'SALIDA') {
            SALIDA = new Date(element.asistencia[index+1].fecha).getTime();
            HORAS = HORAS + SALIDA - fecha.getTime();
            SALIDA = 0;
            ENTRADA = 0;
          }
        } else {
          if (identificador == 'SALIDA' && ENTRADA != 0 && SALIDA == 0) {
            SALIDA = fecha.getTime();
            HORAS = HORAS + SALIDA - ENTRADA;
            SALIDA = 0;
            ENTRADA = 0;
          }
        }



        /*     if (index == 0 && identificador == 'ENTRADA') {//validar si el primer marcador es entrada
              ENTRADA = fecha.getTime();
            } if (index > 0 && identificador == 'ENTRADA' && ENTRADA!=0) {//validar las demas entradas
              ENTRADA = fecha.getTime();
            }
            if (index > 0 && identificador == 'SALIDA' && ENTRADA != 0) {//valida las salidas
              SALIDA = fecha.getTime();
              HORAS = HORAS + SALIDA - ENTRADA;
              SALIDA = 0;
              ENTRADA = 0;
            }
            if(element.asistencia.length-1!=index && new Date(element.asistencia[index+1].fecha).getDate()==(dia+1)&&identificador == 'ENTRADA'){
              if(element.asistencia[index+1].identificador=='SALIDA'){
                ENTRADA=fecha.getTime();
                SALIDA = new Date(element.asistencia[index+1].fecha).getTime();
                HORAS = HORAS + SALIDA - ENTRADA;
                SALIDA = 0;
                ENTRADA = 0;
              }
            } */
      }
    }
    return (HORAS);
  }

  convertirMiliHora(s) {
    if (s == 0) { return '' }
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
    var codigo = '';
    const busqueda = list.reduce((acc, persona) => {
      acc[persona.nombre] = ++acc[persona.nombre] || 0;
      return acc;
    }, {});
    let empNombre = Object.keys(busqueda);
    empNombre.forEach(nombre => {
      fecha = [];
      codigo = '';
      list.forEach(element => {
        if (element.nombre == nombre) {
          fecha.push({ fecha: element.fecha, identificador: element.identificador });
          codigo = element.cod_empleado;
        }
      });
      empleados.push({ nombre: nombre, codigo: codigo, asistencia: fecha });
    });
    return empleados;
  }
}
