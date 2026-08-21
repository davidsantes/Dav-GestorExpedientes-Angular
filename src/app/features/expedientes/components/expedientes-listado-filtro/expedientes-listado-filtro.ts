import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoExpediente } from '../../models/estado-expediente.type';
import { PrioridadExpediente } from '../../models/prioridad-expediente.type';
import { FiltrosExpediente } from '../../models/filtros-expediente.interface';

@Component({
  selector: 'app-expedientes-listado-filtro',
  imports: [FormsModule],
  templateUrl: './expedientes-listado-filtro.html',
  styleUrls: ['./expedientes-listado-filtro.css'],
})
export class ExpedientesListadoFiltro {
  estados = input<EstadoExpediente[]>([]);
  prioridades = input<PrioridadExpediente[]>([]);

  filtrosAplicados = output<FiltrosExpediente | null>();

  protected filtro: FiltrosExpediente = {
    numero: '',
    estado: '',
    prioridad: '',
    fechaInicio: '',
    fechaFin: '',
  };

  buscar(): void {
    this.filtrosAplicados.emit({
      ...this.filtro,
    });
  }

  limpiar(): void {
    this.filtro = {
      numero: '',
      estado: '',
      prioridad: '',
      fechaInicio: '',
      fechaFin: '',
    };

    this.filtrosAplicados.emit(null);
  }
}