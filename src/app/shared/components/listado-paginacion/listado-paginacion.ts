import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-listado-paginacion',
  imports: [],
  templateUrl: './listado-paginacion.html',
  styleUrls: ['./listado-paginacion.css'],
})
/**
 * Componente de paginación reutilizable.
 * - Recibe itemsPorPagina, totalItems e itemsPrevios para calcular el estado actual.
 * - Usa computed para derivar de forma reactiva paginaActual, totalPaginas y estados de borde.
 * - Emite cambioPagina al navegar, para que el contenedor actualice query params y recargue datos.
 * - Garantiza al menos 1 página visible aunque totalItems sea 0.
 */
export class ListadoPaginacion {
  itemsPorPagina = input.required<number>();
  totalItems = input.required<number>();
  itemsPrevios = input.required<number>();

  cambioPagina = output<number>();

  // Computed property to calculate the current page based on itemsPrevios and itemsPorPagina
  paginaActual = computed(() => {
    return Math.floor(this.itemsPrevios() / this.itemsPorPagina()) + 1;
  });

  primeraPagina = computed(() => {
    return this.paginaActual() === 1;
  });

  totalPaginas = computed(() => {
    const total = Math.ceil(this.totalItems() / this.itemsPorPagina());
    return Math.max(total, 1);
  });

  ultimaPagina = computed(() => {
    return this.paginaActual() >= this.totalPaginas();
  });

  navegarAPagina(pagina: number) 
  {
    this.cambioPagina.emit(pagina);
  }
}