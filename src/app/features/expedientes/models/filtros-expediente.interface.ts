import { EstadoExpediente } from './estado-expediente.type';
import { PrioridadExpediente } from './prioridad-expediente.type';

export interface FiltrosExpediente {
  numero: string;
  estado: EstadoExpediente | '';
  prioridad: PrioridadExpediente | '';
  fechaInicio: string;
  fechaFin: string;
}