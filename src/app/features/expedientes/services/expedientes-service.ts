import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Expediente } from '../models/expediente.interface';
import { ExpedientesListadoRespuesta } from '../models/expedientes-listado-respuesta.interface';
import { FiltrosExpediente } from '../models/filtros-expediente.interface';

@Service()
export class ExpedientesService {
  private readonly httpClient = inject(HttpClient);

  getExpedientes(
    filtros: Partial<FiltrosExpediente>,
    skip = 0,
    limit = 30,
  ): Observable<ExpedientesListadoRespuesta> {
    let params = new HttpParams();

    if (filtros.numero) {
      params = params.set('numero', filtros.numero);
    }

    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }

    if (filtros.prioridad) {
      params = params.set('prioridad', filtros.prioridad);
    }

    if (filtros.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      params = params.set('fechaFin', filtros.fechaFin);
    }

    params = params.set('skip', String(skip));
    params = params.set('limit', String(limit));

    return this.httpClient.get<ExpedientesListadoRespuesta>('/api/expedientes', {
      params,
    });
  }

  getExpediente(numero: string): Observable<Expediente> {
    return this.httpClient.get<Expediente>(
      `/api/expedientes/${encodeURIComponent(numero)}`
    );
  }
}