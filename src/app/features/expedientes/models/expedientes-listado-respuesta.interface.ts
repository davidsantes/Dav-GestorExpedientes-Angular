import { Expediente } from './expediente.interface';

export interface ExpedientesListadoRespuesta {
  data: Expediente[];
  total: number;
  skip: number;
  limit: number;
}