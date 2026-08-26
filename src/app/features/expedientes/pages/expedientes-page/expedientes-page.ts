import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ExpedientesListadoFiltro } from '../../components/expedientes-listado-filtro/expedientes-listado-filtro';
import { ExpedientesListado } from '../../components/expedientes-listado/expedientes-listado';
import { EstadoExpediente } from '../../models/estado-expediente.type';
import { Expediente } from '../../models/expediente.interface';
import { FiltrosExpediente } from '../../models/filtros-expediente.interface';
import { PrioridadExpediente } from '../../models/prioridad-expediente.type';
import { ExpedientesService } from '../../services/expedientes-service';
import { ListadoPaginacion } from '../../../../shared/components/listado-paginacion/listado-paginacion';

@Component({
  selector: 'app-expedientes-page',
  imports: [ExpedientesListadoFiltro, ExpedientesListado, ListadoPaginacion],
  templateUrl: './expedientes-page.html',
  styleUrl: './expedientes-page.css',
})
/**
 * Página principal de expedientes.
 * - Lee filtros y número de página desde query params (withComponentInputBinding).
 * - Carga datos paginados con rxResource llamando al servicio de expedientes.
 * - rxResource conecta señales (params) con un Observable (stream):
 *   cuando cambian los params, relanza la petición y actualiza estado/valor reactivo.
 * - Expone la lista para el template y el estado de respuesta paginada.
 * - Gestiona navegación: aplicar filtros, cambiar página y abrir detalle.
 * - Normaliza el número de página para evitar valores inválidos.
 */
export class ExpedientesPage {
  private readonly router = inject(Router);
  private readonly expedientesService = inject(ExpedientesService);

  numero = input('');
  estado = input<EstadoExpediente | ''>('');
  prioridad = input<PrioridadExpediente | ''>('');
  fechaInicio = input('');
  fechaFin = input('');
  numeroPagina = input<number | string>();

  protected readonly resultadosPorPagina = 5;

  protected estados: EstadoExpediente[] = [
    'pendiente',
    'tramite',
    'finalizado',
    'archivado',
  ];

  protected prioridades: PrioridadExpediente[] = [
    'alta',
    'media',
    'baja',
  ];

  protected recursoExpedientes = rxResource({
    params: () => ({
      numero: this.numero(),
      estado: this.estado(),
      prioridad: this.prioridad(),
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
      numeroPagina: this.numeroPagina(),
    }),
    stream: ({ params }) =>
      this.expedientesService.getExpedientes(
        {
          numero: params.numero,
          estado: params.estado,
          prioridad: params.prioridad,
          fechaInicio: params.fechaInicio,
          fechaFin: params.fechaFin,
        },
        (this.normalizarNumeroPagina(params.numeroPagina) - 1) *
          this.resultadosPorPagina,
        this.resultadosPorPagina,
      ),
  });

  protected respuestaExpedientes = this.recursoExpedientes.value;

  protected expedientes = computed<Expediente[]>(() => {
    return this.respuestaExpedientes()?.data ?? [];
  });

  aplicarFiltros(filtros: FiltrosExpediente | null): void {
    this.router.navigate(['/expedientes'], {
      queryParams: {
        numero: filtros?.numero || null,
        estado: filtros?.estado || null,
        prioridad: filtros?.prioridad || null,
        fechaInicio: filtros?.fechaInicio || null,
        fechaFin: filtros?.fechaFin || null,
        numeroPagina: null,
      },
    });
  }

  cambioPagina(pagina: number): void {
    this.router.navigate(['/expedientes'], {
      queryParams: {
        numero: this.numero() || null,
        estado: this.estado() || null,
        prioridad: this.prioridad() || null,
        fechaInicio: this.fechaInicio() || null,
        fechaFin: this.fechaFin() || null,
        numeroPagina: pagina || null,
      },
    });
  }

  seleccionarExpediente(expediente: Expediente): void {
    this.router.navigate(['/expedientes', expediente.numero]);
  }

  private normalizarNumeroPagina(numeroPagina: number | string | undefined): number {
    const pagina = Number(numeroPagina ?? 1);

    if (!Number.isFinite(pagina) || pagina < 1) {
      return 1;
    }

    return Math.floor(pagina);
  }
}
