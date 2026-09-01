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
});
