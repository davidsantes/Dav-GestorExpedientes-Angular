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
});
