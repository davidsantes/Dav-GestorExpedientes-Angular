import {
  HttpInterceptorFn,
  HttpResponse
} from '@angular/common/http';
import type { Expediente } from '../../features/expedientes/models/expediente.interface';
import { of } from 'rxjs';

const EXPEDIENTES_MOCK: Expediente[] = [
  {
    numero: 'EXP-2026-0001',
    titulo: 'Solicitud de licencia de actividad 1',
    estado: 'tramite',
    prioridad: 'alta',
    fechaAlta: '2026-08-12'
  },
  {
    numero: 'EXP-2026-0002',
    titulo: 'Recurso administrativo',
    estado: 'pendiente',
    prioridad: 'media',
    fechaAlta: '2026-08-10'
  },
  {
    numero: 'EXP-2026-0003',
    titulo: 'Autorización de obra menor',
    estado: 'finalizado',
    prioridad: 'baja',
    fechaAlta: '2026-08-08'
  },
  {
    numero: 'EXP-2026-0004',
    titulo: 'Solicitud de licencia de actividad 2',
    estado: 'tramite',
    prioridad: 'media',
    fechaAlta: '2025-08-12'
  },
];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.method === 'GET' && req.url === '/api/expedientes') {
    const numero = (req.params.get('numero') ?? '').trim().toLowerCase();
    const estado = req.params.get('estado') ?? '';
    const prioridad = req.params.get('prioridad') ?? '';
    const fechaInicio = req.params.get('fechaInicio') ?? '';
    const fechaFin = req.params.get('fechaFin') ?? '';

    const expedientes = EXPEDIENTES_MOCK.filter((expediente) => {
      const coincideNumero =
        !numero || expediente.numero.toLowerCase().includes(numero);
      const coincideEstado = !estado || expediente.estado === estado;
      const coincidePrioridad = !prioridad || expediente.prioridad === prioridad;
      const coincideFechaInicio =
        !fechaInicio || expediente.fechaAlta >= fechaInicio;
      const coincideFechaFin = !fechaFin || expediente.fechaAlta <= fechaFin;

      return (
        coincideNumero &&
        coincideEstado &&
        coincidePrioridad &&
        coincideFechaInicio &&
        coincideFechaFin
      );
    });

    return of(
      new HttpResponse({
        status: 200,
        body: expedientes
      })
    );

  }

  const expedienteDetalleMatch = req.method === 'GET'
    ? req.url.match(/^\/api\/expedientes\/([^/]+)$/)
    : null;

  if (expedienteDetalleMatch) {

    const numero = expedienteDetalleMatch[1];
    const expediente = EXPEDIENTES_MOCK.find(exp => exp.numero === numero);

    if (!expediente) {
      return of(
        new HttpResponse({
          status: 404,
          body: null
        })
      );
    }

    return of(
      new HttpResponse({
        status: 200,
        body: expediente
      })
    );

  }

  return next(req);
};