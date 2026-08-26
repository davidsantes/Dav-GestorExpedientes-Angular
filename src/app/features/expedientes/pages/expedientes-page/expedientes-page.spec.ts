import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { routes } from '../../../../app.routes';
import { EXPEDIENTES_MOCK } from '../../data/expedientes.mock';
import { ExpedientesPage } from './expedientes-page';

describe('ExpedientesPage', () => {
  let component: ExpedientesPage;
  let fixture: ComponentFixture<ExpedientesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedientesPage],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedientesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all expedientes without filters', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(
      EXPEDIENTES_MOCK.length,
    );
  });

  it('should navigate to the selected expediente detail', async () => {
    component.seleccionarExpediente({
      numero: 'EXP-2026-0001',
      titulo: 'Solicitud de licencia de actividad',
      estado: 'tramite',
      prioridad: 'alta',
      fechaAlta: '2026-08-12',
    });

    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/expedientes/EXP-2026-0001');
  });

  it('should persist the filters in the query params', async () => {
    component.aplicarFiltros({
      numero: '0002',
      estado: 'pendiente',
      prioridad: '',
      fechaInicio: '',
      fechaFin: '',
    });

    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe(
      '/expedientes?numero=0002&estado=pendiente',
    );
  });
});
