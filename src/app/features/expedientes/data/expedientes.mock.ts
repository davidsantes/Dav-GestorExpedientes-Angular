import { Expediente } from '../models/expediente.interface';

export const EXPEDIENTES_MOCK: Expediente[] = [
    {
      numero: 'EXP-2026-0001',
      titulo: 'Solicitud de licencia de actividad',
      estado: 'tramite',
      prioridad: 'alta',
      fechaAlta: '2026-08-12',
    },
    {
      numero: 'EXP-2026-0002',
      titulo: 'Recurso administrativo',
      estado: 'pendiente',
      prioridad: 'media',
      fechaAlta: '2026-08-10',
    },
    {
      numero: 'EXP-2026-0003',
      titulo: 'Autorización de obra menor',
      estado: 'finalizado',
      prioridad: 'baja',
      fechaAlta: '2026-08-08',
    },
  ];