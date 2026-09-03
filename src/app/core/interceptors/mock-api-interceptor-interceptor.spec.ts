import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { mockApiInterceptor } from './mock-api-interceptor-interceptor';

describe('mockApiInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => mockApiInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('filtra y pagina el listado de expedientes desde el mock en memoria', async () => {
    const req = new HttpRequest('GET', '/api/expedientes').clone({
      setParams: {
        estado: 'tramite',
        skip: '0',
        limit: '2',
      },
    });

    const respuesta = await firstValueFrom(interceptor(req, () => {
      throw new Error('La peticion deberia resolverla el mockApiInterceptor');
    }));

    expect(respuesta).toBeInstanceOf(HttpResponse);
    expect((respuesta as HttpResponse<unknown>).body).toMatchObject({
      total: expect.any(Number),
      skip: 0,
      limit: 2,
    });
    expect(((respuesta as HttpResponse<{ data: { estado: string }[] }>).body?.data ?? []))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ estado: 'tramite' }),
      ]));
  });

  it('devuelve 404 cuando el detalle no existe', async () => {
    const req = new HttpRequest('GET', '/api/expedientes/NO-EXISTE');

    const respuesta = await firstValueFrom(interceptor(req, () => {
      throw new Error('La peticion deberia resolverla el mockApiInterceptor');
    }));

    expect(respuesta).toBeInstanceOf(HttpResponse);
    expect((respuesta as HttpResponse<unknown>).status).toBe(404);
    expect((respuesta as HttpResponse<unknown>).body).toBeNull();
  });

  it('delega al siguiente handler cuando la URL no pertenece a la API mock', async () => {
    const req = new HttpRequest('GET', '/assets/logo.svg');
    const respuestaDelegada = new HttpResponse({ status: 204 });

    const respuesta = await firstValueFrom(interceptor(req, () => of(respuestaDelegada)));

    expect(respuesta).toBe(respuestaDelegada);
  });
});
