import { Component, Signal, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Expediente } from '../../models/expediente.interface';
import { EXPEDIENTES_MOCK } from '../../data/expedientes.mock';

@Component({
  selector: 'app-expediente-detalle-page',
  imports: [],
  templateUrl: './expediente-detalle-page.html',
  styleUrls: ['./expediente-detalle-page.css'],
})

export class ExpedienteDetallePage {
  numero = input('');

  private readonly router = inject(Router);

  expediente: Signal<Expediente> = computed(() => {
    const numero = this.numero();
    return EXPEDIENTES_MOCK.find(expediente => expediente.numero === numero) || { numero: '', titulo: '', estado: 'tramite', prioridad: 'media', fechaAlta: '' };
  });

  async volver(): Promise<void> {
    await this.router.navigate(['/expedientes']);
  }
}
