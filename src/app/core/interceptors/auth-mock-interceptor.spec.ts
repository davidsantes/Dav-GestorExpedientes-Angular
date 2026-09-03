import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { generarToken } from '../auth/token.util';
import { authMockInterceptor } from './auth-mock-interceptor';

describe('authMockInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authMockInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('autentica credenciales validas y devuelve token con rol', async () => {
    const req = new HttpRequest('POST', '/api/auth/login', {
      user: 'admin',
      pass: 'admin',
    });

    const respuesta = await firstValueFrom(interceptor(req, () => {
      throw new Error('El login deberia resolverlo authMockInterceptor');
    }));

    expect(respuesta).toBeInstanceOf(HttpResponse);
    expect((respuesta as HttpResponse<{ user: string; rol: string; token: string }>).body)
      .toMatchObject({
        user: 'admin',
        rol: 'EDITOR',
        token: expect.stringContaining('mock.'),
      });
  });

  it('devuelve 403 si un lector intenta acceder al detalle de un expediente', async () => {
    const tokenLector = generarToken({
      user: 'user',
      rol: 'LECTOR',
      exp: Date.now() + 60_000,
    });
    const req = new HttpRequest('GET', '/api/expedientes/EXP-2026-0001').clone({
      setHeaders: { Authorization: `Bearer ${tokenLector}` },
    });

    await expect(firstValueFrom(interceptor(req, () => {
      throw new Error('La autorizacion deberia resolverla authMockInterceptor');
    }))).rejects.toMatchObject({
      status: 403,
    });
  });
});
