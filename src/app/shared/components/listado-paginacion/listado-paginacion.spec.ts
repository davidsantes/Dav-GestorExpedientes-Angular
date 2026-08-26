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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
