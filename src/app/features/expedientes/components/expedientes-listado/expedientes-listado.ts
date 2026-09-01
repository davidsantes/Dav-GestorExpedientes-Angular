import { Component, Input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Expediente } from '../../models/expediente.interface';

@Component({
  selector: 'app-expedientes-listado',
  imports: [MatButtonModule, MatIconModule, MatSortModule, MatTableModule],
  templateUrl: './expedientes-listado.html',
  styleUrl: './expedientes-listado.css',
})
export class ExpedientesListado {
  @Input()
  set expedientes(expedientes: Expediente[]) {
    this.expedientesOriginales.set(expedientes);
    this.expedientesOrdenados.set(expedientes);
  }

  protected readonly columnas = ['numero', 'titulo', 'estado', 'prioridad', 'fechaAlta', 'opciones'];
  protected readonly expedientesOrdenados = signal<Expediente[]>([]);
  private readonly expedientesOriginales = signal<Expediente[]>([]);

  expedienteSeleccionado = output<Expediente>();
  paginaAnterior = output<void>();
  paginaSeleccionada = output<number>();
  paginaSiguiente = output<void>();

  seleccionar(expediente: Expediente): void {
    this.expedienteSeleccionado.emit(expediente);
  }

  ordenar(orden: Sort): void {
    const expedientes = this.expedientesOriginales();

    if (!orden.direction) {
      this.expedientesOrdenados.set(expedientes);
      return;
    }

    const multiplicador = orden.direction === 'asc' ? 1 : -1;
    const comparador = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

    this.expedientesOrdenados.set(
      [...expedientes].sort((expedienteA, expedienteB) => {
        return multiplicador * comparador.compare(expedienteA[orden.active as keyof Expediente], expedienteB[orden.active as keyof Expediente]);
      }),
    );
  }

  seleccionarPagina(pagina: number): void {
    console.log('Página seleccionada:', pagina);
    this.paginaSeleccionada.emit(pagina);
  }

  irAPaginaAnterior(): void {
    console.log('Ir a la página anterior');
    this.paginaAnterior.emit();
  }

  irAPaginaSiguiente(): void {
    console.log('Ir a la página siguiente');
    this.paginaSiguiente.emit();
  }
}
