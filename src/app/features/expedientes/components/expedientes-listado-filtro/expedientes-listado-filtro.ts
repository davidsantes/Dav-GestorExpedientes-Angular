import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstadoExpediente } from '../../models/estado-expediente.type';
import { PrioridadExpediente } from '../../models/prioridad-expediente.type';
import { FiltrosExpediente } from '../../models/filtros-expediente.interface';

@Component({
  selector: 'app-expedientes-listado-filtro',
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './expedientes-listado-filtro.html',
  styleUrl: './expedientes-listado-filtro.css',
})
export class ExpedientesListadoFiltro {
  estados = input<readonly EstadoExpediente[]>([]);
  prioridades = input<readonly PrioridadExpediente[]>([]);

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
