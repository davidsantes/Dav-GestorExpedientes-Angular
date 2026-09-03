import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ExpedientesService } from './expedientes-service';

describe('ExpedientesService', () => {
  let service: ExpedientesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExpedientesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('construye la consulta del listado con filtros y paginacion', () => {
    service.getExpedientes(
      {
        numero: '0001',
        estado: 'tramite',
        prioridad: 'alta',
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-31',
      },
      5,
      5,
    ).subscribe((respuesta) => {
      expect(respuesta.total).toBe(1);
    });

    const req = httpTesting.expectOne((request) => request.url === '/api/expedientes');

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('numero')).toBe('0001');
    expect(req.request.params.get('estado')).toBe('tramite');
    expect(req.request.params.get('prioridad')).toBe('alta');
    expect(req.request.params.get('fechaInicio')).toBe('2026-08-01');
    expect(req.request.params.get('fechaFin')).toBe('2026-08-31');
    expect(req.request.params.get('skip')).toBe('5');
    expect(req.request.params.get('limit')).toBe('5');

    req.flush({ data: [], total: 1, skip: 5, limit: 5 });
  });

  it('actualiza el expediente usando el numero como parte de la URL y el expediente como body', () => {
    const expediente = {
      numero: 'EXP-2026-0001',
      titulo: 'Solicitud revisada',
      estado: 'tramite',
      prioridad: 'media',
      fechaAlta: '2026-08-12',
    } as const;

    service.actualizarExpediente(expediente).subscribe((respuesta) => {
      expect(respuesta).toEqual(expediente);
    });

    const req = httpTesting.expectOne('/api/expedientes/EXP-2026-0001');

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(expediente);

    req.flush(expediente);
  });
});
