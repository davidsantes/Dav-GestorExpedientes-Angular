import { Component, computed, inject, input, resource } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ExpedientesListadoFiltro } from '../../components/expedientes-listado-filtro/expedientes-listado-filtro';
import { ExpedientesListado } from '../../components/expedientes-listado/expedientes-listado';
import { EstadoExpediente } from '../../models/estado-expediente.type';
import { Expediente } from '../../models/expediente.interface';
import { FiltrosExpediente } from '../../models/filtros-expediente.interface';
import { PrioridadExpediente } from '../../models/prioridad-expediente.type';
import { ExpedientesService } from '../../services/expedientes-service';

@Component({
  selector: 'app-expedientes-page',
  imports: [ExpedientesListadoFiltro, ExpedientesListado],
  templateUrl: './expedientes-page.html',
  styleUrl: './expedientes-page.css',
})
export class ExpedientesPage {
  private readonly router = inject(Router);
  private readonly expedientesService = inject(ExpedientesService);

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

  protected recursoExpedientes = resource({
    params: () => ({
      numero: this.numero(),
      estado: this.estado(),
      prioridad: this.prioridad(),
      fechaInicio: this.fechaInicio(),
      fechaFin: this.fechaFin(),
    }),
    loader: ({ params }) => firstValueFrom(this.expedientesService.getExpedientes(params)),
  });

  protected expedientes = computed<Expediente[]>(() => {
    return this.recursoExpedientes.value() ?? [];
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
