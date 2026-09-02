import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from '../../../../core/services/auth-service';
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

  it('should emit the selected page number', () => {
    let pagina: number | undefined;
    component.paginaSeleccionada.subscribe((valor) => pagina = valor);

    component.seleccionarPagina(2);

    expect(pagina).toBe(2);
  });

  it('should emit previous and next page events', () => {
    let paginaAnteriorEmitida = false;
    let paginaSiguienteEmitida = false;
    component.paginaAnterior.subscribe(() => paginaAnteriorEmitida = true);
    component.paginaSiguiente.subscribe(() => paginaSiguienteEmitida = true);

    component.irAPaginaAnterior();
    component.irAPaginaSiguiente();

    expect(paginaAnteriorEmitida).toBe(true);
    expect(paginaSiguienteEmitida).toBe(true);
  });
});
