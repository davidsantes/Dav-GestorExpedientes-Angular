export const ESTADOS_EXPEDIENTE = [
  'pendiente',
  'tramite',
  'finalizado',
  'archivado',
] as const;

export type EstadoExpediente = (typeof ESTADOS_EXPEDIENTE)[number];