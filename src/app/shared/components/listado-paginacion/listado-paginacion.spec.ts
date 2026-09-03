import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoPaginacion } from './listado-paginacion';

describe('ListadoPaginacion', () => {
  let component: ListadoPaginacion;
  let fixture: ComponentFixture<ListadoPaginacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPaginacion],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoPaginacion);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('itemsPorPagina', 5);
    fixture.componentRef.setInput('totalItems', 10);
    fixture.componentRef.setInput('itemsPrevios', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calcula la pagina actual a partir de los items previos', () => {
    fixture.componentRef.setInput('itemsPrevios', 5);

    expect(component.paginaActual()).toBe(2);
    expect(component.primeraPagina()).toBe(false);
    expect(component.ultimaPagina()).toBe(true);
  });

  it('emite pagina uno-basada aunque MatPaginator use indices cero-basados', () => {
    let pagina: number | undefined;
    component.cambioPagina.subscribe((valor) => pagina = valor);

    component.navegarAPagina({ pageIndex: 2, pageSize: 5, length: 15 });

    expect(pagina).toBe(3);
  });
});
