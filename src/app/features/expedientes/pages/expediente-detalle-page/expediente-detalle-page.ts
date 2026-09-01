import { Component, Signal, computed, effect, inject, input, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Expediente } from '../../models/expediente.interface';
import { ExpedienteForm } from '../../models/expediente-form.interface';
import { ESTADOS_EXPEDIENTE } from '../../models/estado-expediente.type';
import { PRIORIDADES_EXPEDIENTE } from '../../models/prioridad-expediente.type';
import { EXPEDIENTES_MOCK } from '../../data/expedientes.mock';
import { ExpedientesService } from '../../services/expedientes-service';

@Component({
  selector: 'app-expediente-detalle-page',
  imports: [FormField, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './expediente-detalle-page.html',
  styleUrl: './expediente-detalle-page.css',
})
export class ExpedienteDetallePage {
  numero = input('');
  modo = input<'consulta' | 'editar'>('consulta');

  protected readonly estados = ESTADOS_EXPEDIENTE;
  protected readonly prioridades = PRIORIDADES_EXPEDIENTE;

  private readonly router = inject(Router);
  private readonly expedientesService = inject(ExpedientesService);

  expediente: Signal<Expediente> = computed(() => {
    const numero = this.numero();
    return (
      EXPEDIENTES_MOCK.find((expediente) => expediente.numero === numero) || {
        numero: '',
        titulo: '',
        estado: 'tramite',
        prioridad: 'media',
        fechaAlta: '',
      }
    );
  });

  esEdicion = computed(() => this.modo() === 'editar');

  modeloEdicion = signal<ExpedienteForm>({
    numero: '',
    titulo: '',
    estado: 'tramite',
    prioridad: 'media',
    fechaAlta: null,
  });

  formularioEdicion = form(this.modeloEdicion, (schemaPath) => {
    required(schemaPath.titulo, { message: 'El título es obligatorio' });
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
      this.expedientesService.actualizarExpediente(this.aExpediente(this.modeloEdicion())),
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
      fechaAlta: this.aFecha(expediente.fechaAlta),
    };
  }

  private aExpediente(formulario: ExpedienteForm): Expediente {
    return {
      numero: formulario.numero,
      titulo: formulario.titulo,
      estado: formulario.estado,
      prioridad: formulario.prioridad,
      fechaAlta: this.aFechaIso(formulario.fechaAlta),
    };
  }

  private aFecha(fecha: string): Date | null {
    const [ano, mes, dia] = fecha.split('-').map(Number);

    if (!ano || !mes || !dia) {
      return null;
    }

    return new Date(ano, mes - 1, dia);
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
