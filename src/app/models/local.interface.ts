import { Empresa } from "./empresa.interface";

export interface Local {
    localId:     number;
    descripcion: string;
    ruc:         string;
    empresa:     Empresa;
    seleccionado:boolean;
}
