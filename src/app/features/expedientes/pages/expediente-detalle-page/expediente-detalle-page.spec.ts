import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';

import { ExpedienteDetallePage } from './expediente-detalle-page';

describe('ExpedienteDetallePage', () => {
  let component: ExpedienteDetallePage;
  let fixture: ComponentFixture<ExpedienteDetallePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedienteDetallePage],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedienteDetallePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the expediente identified by the route input', () => {
    fixture.componentRef.setInput('numero', 'EXP-2026-0001');

    expect(component.expediente().titulo).toBe('Solicitud de licencia de actividad');
  });

  it('should navigate back to the expedientes list', async () => {
    await component.volver();

    expect(TestBed.inject(Router).url).toBe('/expedientes');
  });
});
