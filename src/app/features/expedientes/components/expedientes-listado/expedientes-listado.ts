import { Component, Input, output } from '@angular/core';
import { Expediente } from '../../models/expediente.interface';

@Component({
  selector: 'app-expedientes-listado',
  imports: [],
  templateUrl: './expedientes-listado.html',
  styleUrl: './expedientes-listado.css',
})
export class ExpedientesListado {
  @Input() expedientes: Expediente[] = [];

  expedienteSeleccionado = output<Expediente>();
  paginaAnterior = output<void>();
  paginaSeleccionada = output<number>();
  paginaSiguiente = output<void>();

  seleccionar(expediente: Expediente): void {
    this.expedienteSeleccionado.emit(expediente);
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
