import { EstadoExpediente } from './estado-expediente.type';
import { PrioridadExpediente } from './prioridad-expediente.type';

export interface Expediente {
  numero: string;
  titulo: string;
  estado: EstadoExpediente;
  prioridad: PrioridadExpediente;
  fechaAlta: string;
}