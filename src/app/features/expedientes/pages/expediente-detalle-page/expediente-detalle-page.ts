import { Component, Signal, computed, effect, inject, input, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Expediente } from '../../models/expediente.interface';
import { ExpedienteForm } from '../../models/expediente-form.interface';
import { EXPEDIENTES_MOCK } from '../../data/expedientes.mock';
import { ExpedientesService } from '../../services/expedientes-service';

@Component({
  selector: 'app-expediente-detalle-page',
  imports: [FormField],
  templateUrl: './expediente-detalle-page.html',
  styleUrls: ['./expediente-detalle-page.css'],
})

export class ExpedienteDetallePage {
  numero = input('');
  modo = input<'consulta' | 'editar'>('consulta');

  private readonly router = inject(Router);
  private readonly expedientesService = inject(ExpedientesService);

  expediente: Signal<Expediente> = computed(() => {
    const numero = this.numero();
    return EXPEDIENTES_MOCK.find(expediente => expediente.numero === numero) || { numero: '', titulo: '', estado: 'tramite', prioridad: 'media', fechaAlta: '' };
  });

  esEdicion = computed(() => this.modo() === 'editar');

  modeloEdicion = signal<ExpedienteForm>({
    numero: '',
    titulo: '',
    estado: 'tramite',
    prioridad: 'media',
    fechaAlta: '',
  });

  formularioEdicion = form(this.modeloEdicion, (schemaPath) => {
    required(schemaPath.titulo, { message: 'El titulo es obligatorio' });
    required(schemaPath.fechaAlta, { message: 'La fecha de alta es obligatoria' });
  });

  constructor() {
    effect(() => {
      const expediente = this.expediente();

      if (expediente.numero) {
        this.modeloEdicion.set(this.aFormulario(expediente));
      }
    });
  }

  editar(): void {
    this.router.navigate(['/expedientes', this.expediente().numero, 'editar']);
  }

  async guardar(): Promise<void> {
    if (this.formularioEdicion().invalid()) {
      return;
    }

    await firstValueFrom(
      this.expedientesService.actualizarExpediente(
        this.aExpediente(this.modeloEdicion()),
      ),
    );
    await this.volver();
  }

  async volver(): Promise<void> {
    await this.router.navigate(['/expedientes']);
  }

  private aFormulario(expediente: Expediente): ExpedienteForm {
    return {
      numero: expediente.numero,
      titulo: expediente.titulo,
      estado: expediente.estado,
      prioridad: expediente.prioridad,
      fechaAlta: expediente.fechaAlta,
    };
  }

  private aExpediente(formulario: ExpedienteForm): Expediente {
    return {
      numero: formulario.numero,
      titulo: formulario.titulo,
      estado: formulario.estado,
      prioridad: formulario.prioridad,
      fechaAlta: formulario.fechaAlta,
    };
  }
}
