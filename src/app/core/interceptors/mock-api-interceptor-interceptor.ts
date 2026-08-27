import {
  HttpInterceptorFn,
  HttpResponse
} from '@angular/common/http';
import type { ExpedientesListadoRespuesta } from '../../features/expedientes/models/expedientes-listado-respuesta.interface';
import type { Expediente } from '../../features/expedientes/models/expediente.interface';
import { EXPEDIENTES_MOCK } from '../../features/expedientes/data/expedientes.mock';
import { of } from 'rxjs';

/**
 * Intercepta llamadas HTTP de la API mock de expedientes.
 * - GET /api/expedientes: aplica filtros (numero, estado, prioridad, fechas),
 *   pagina con skip/limit y devuelve { data, total, skip, limit }.
 * - GET /api/expedientes/:numero: devuelve el detalle del expediente o 404 si no existe.
 * - Cualquier otra petición se delega al siguiente interceptor/handler.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.method === 'GET' && req.url === '/api/expedientes') {
    const numero = (req.params.get('numero') ?? '').trim().toLowerCase();
    const estado = req.params.get('estado') ?? '';
    const prioridad = req.params.get('prioridad') ?? '';
    const fechaInicio = req.params.get('fechaInicio') ?? '';
    const fechaFin = req.params.get('fechaFin') ?? '';
    const skip = Number(req.params.get('skip') ?? 0);
    const limit = Number(req.params.get('limit') ?? 30);

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

    const skipNormalizado = Number.isFinite(skip) && skip > 0 ? Math.floor(skip) : 0;
    const limitNormalizado = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 30;
    const data = expedientes.slice(skipNormalizado, skipNormalizado + limitNormalizado);
    const respuesta: ExpedientesListadoRespuesta = {
      data,
      total: expedientes.length,
      skip: skipNormalizado,
      limit: limitNormalizado,
    };

    return of(
      new HttpResponse({
        status: 200,
        body: respuesta
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

  const expedienteActualizacionMatch = req.method === 'PUT'
    ? req.url.match(/^\/api\/expedientes\/([^/]+)$/)
    : null;

  if (expedienteActualizacionMatch) {
    const numero = expedienteActualizacionMatch[1];
    const indice = EXPEDIENTES_MOCK.findIndex(expediente => expediente.numero === numero);

    if (indice === -1) {
      return of(new HttpResponse<null>({ status: 404, body: null }));
    }

    const expedienteActualizado: Expediente = {
      ...(req.body as Expediente),
      numero,
    };
    EXPEDIENTES_MOCK[indice] = expedienteActualizado;

    return of(new HttpResponse({ status: 200, body: expedienteActualizado }));
  }

  return next(req);
};