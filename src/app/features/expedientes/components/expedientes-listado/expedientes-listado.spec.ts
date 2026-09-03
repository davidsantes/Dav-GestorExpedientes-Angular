import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../../../core/services/auth-service';
import { Expediente } from '../../models/expediente.interface';
import { ExpedientesListado } from './expedientes-listado';

describe('ExpedientesListado', () => {
  let component: ExpedientesListado;
  let fixture: ComponentFixture<ExpedientesListado>;
  const esUsuarioEditor = signal(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedientesListado],
      providers: [
        { provide: AuthService, useValue: { esUsuarioEditor } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedientesListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('solo muestra la opción de consultar a editores', () => {
    const columnas = (component as unknown as { columnas: () => string[] }).columnas;

    expect(columnas()).not.toContain('opciones');

    esUsuarioEditor.set(true);

    expect(columnas()).toContain('opciones');
  });

  it('emite el expediente seleccionado', () => {
    const expediente = {
      numero: 'EXP-2026-0001',
      titulo: 'Solicitud de licencia',
      estado: 'tramite',
      prioridad: 'media',
      fechaAlta: '2026-08-01',
    } satisfies Expediente;
    let seleccionado: Expediente | undefined;
    component.expedienteSeleccionado.subscribe((valor) => seleccionado = valor);

    component.seleccionar(expediente);

    expect(seleccionado).toBe(expediente);
  });
});
