import { Component, computed, inject, input, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ExpedientesListadoFiltro } from '../../components/expedientes-listado-filtro/expedientes-listado-filtro';
import { ExpedientesListado } from '../../components/expedientes-listado/expedientes-listado';
import { EstadoExpediente } from '../../models/estado-expediente.type';
import { Expediente } from '../../models/expediente.interface';
import { FiltrosExpediente } from '../../models/filtros-expediente.interface';
import { PrioridadExpediente } from '../../models/prioridad-expediente.type';

@Component({
  selector: 'app-expedientes-page',
  imports: [ExpedientesListadoFiltro, ExpedientesListado],
  templateUrl: './expedientes-page.html',
  styleUrl: './expedientes-page.css',
})
export class ExpedientesPage {
  private readonly router = inject(Router);

  numero = input('');
  estado = input<EstadoExpediente | ''>('');
  prioridad = input<PrioridadExpediente | ''>('');
  fechaInicio = input('');
  fechaFin = input('');

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

  private readonly todosExpedientes: Expediente[] = [
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

  protected expedientes: Signal<Expediente[]> = computed(() => {
    const numero = (this.numero() ?? '').trim().toLowerCase();
    const estado = this.estado() ?? '';
    const prioridad = this.prioridad() ?? '';
    const fechaInicio = this.fechaInicio() ?? '';
    const fechaFin = this.fechaFin() ?? '';

    return this.todosExpedientes.filter((expediente) => {
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
  });

  aplicarFiltros(filtros: FiltrosExpediente | null): void {
    this.router.navigate(['/expedientes'], {
      queryParams: {
        numero: filtros?.numero || null,
        estado: filtros?.estado || null,
        prioridad: filtros?.prioridad || null,
        fechaInicio: filtros?.fechaInicio || null,
        fechaFin: filtros?.fechaFin || null,
      },
    });
  }

  seleccionarExpediente(expediente: Expediente): void {
    this.router.navigate(['/expedientes', expediente.numero]);
  }
}
