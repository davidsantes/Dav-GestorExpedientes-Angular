import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesListadoFiltro } from './expedientes-listado-filtro';

describe('ExpedientesListadoFiltro', () => {
  let component: ExpedientesListadoFiltro;
  let fixture: ComponentFixture<ExpedientesListadoFiltro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedientesListadoFiltro],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedientesListadoFiltro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected dates in ISO format', () => {
    let filtrosEmitidos: unknown;
    const filtro = component as unknown as {
      fechaInicio: Date | null;
      fechaFin: Date | null;
    };
    component.filtrosAplicados.subscribe((filtros) => filtrosEmitidos = filtros);
    filtro.fechaInicio = new Date(2026, 7, 1);
    filtro.fechaFin = new Date(2026, 7, 31);

    component.buscar();

    expect(filtrosEmitidos).toMatchObject({
      fechaInicio: '2026-08-01',
      fechaFin: '2026-08-31',
    });
  });
});
