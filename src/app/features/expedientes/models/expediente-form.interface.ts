import { EstadoExpediente } from './estado-expediente.type';
import { PrioridadExpediente } from './prioridad-expediente.type';

export interface ExpedienteForm {
  numero: string;
  titulo: string;
  estado: EstadoExpediente;
  prioridad: PrioridadExpediente;
  fechaAlta: Date | null;
}