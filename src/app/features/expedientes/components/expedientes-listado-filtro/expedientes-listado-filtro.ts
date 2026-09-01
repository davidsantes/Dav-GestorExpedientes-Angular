import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EstadoExpediente } from '../../models/estado-expediente.type';
import { PrioridadExpediente } from '../../models/prioridad-expediente.type';
import { FiltrosExpediente } from '../../models/filtros-expediente.interface';

@Component({
  selector: 'app-expedientes-listado-filtro',
  imports: [FormsModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule],
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
  protected fechaInicio: Date | null = null;
  protected fechaFin: Date | null = null;

  buscar(): void {
    this.filtrosAplicados.emit({
      ...this.filtro,
      fechaInicio: this.aFechaIso(this.fechaInicio),
      fechaFin: this.aFechaIso(this.fechaFin),
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
    this.fechaInicio = null;
    this.fechaFin = null;

    this.filtrosAplicados.emit(null);
  }

  private aFechaIso(fecha: Date | null): string {
    if (!fecha) {
      return '';
    }

    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }
}
