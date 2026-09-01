export const PRIORIDADES_EXPEDIENTE = ['alta', 'media', 'baja'] as const;

export type PrioridadExpediente = (typeof PRIORIDADES_EXPEDIENTE)[number];