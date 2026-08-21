import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedientesListado } from './expedientes-listado';

describe('ExpedientesListado', () => {
  let component: ExpedientesListado;
  let fixture: ComponentFixture<ExpedientesListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedientesListado],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedientesListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
