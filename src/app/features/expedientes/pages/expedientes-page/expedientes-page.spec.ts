import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';

import { mockApiInterceptor } from '../../../../core/interceptors/mock-api-interceptor-interceptor';
import { ExpedientesPage } from './expedientes-page';

describe('ExpedientesPage', () => {
  let component: ExpedientesPage;
  let fixture: ComponentFixture<ExpedientesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedientesPage],
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        provideRouter([
          { path: 'expedientes', component: ExpedientesPage },
          { path: 'expedientes/:numero', component: ExpedientesPage },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedientesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the first page without filters', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(
      5,
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
