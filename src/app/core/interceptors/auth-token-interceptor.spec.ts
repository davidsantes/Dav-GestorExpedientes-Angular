import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { authTokenInterceptor } from './auth-token-interceptor';

describe('authTokenInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authTokenInterceptor(req, next));

  function configureInterceptor(token: string | null = 'token-de-prueba') {
    const authService = {
      session: () => token ? { token } : null,
      logout: vi.fn(),
    };
    const router = {
      url: '/expedientes/EXP-2026-0001',
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    return { authService, router };
  }

  it('añade el token de sesion a la cabecera Authorization', async () => {
    configureInterceptor('abc123');
    const req = new HttpRequest('GET', '/api/expedientes');

    await firstValueFrom(interceptor(req, (request) => {
      expect(request.headers.get('Authorization')).toBe('Bearer abc123');
      return of(new HttpResponse({ status: 200 }));
    }));
  });

  it('cierra sesion y conserva returnUrl cuando la API responde 401', async () => {
    const { authService, router } = configureInterceptor('token-caducado');
    const req = new HttpRequest('GET', '/api/expedientes');
    const error401 = new HttpErrorResponse({ status: 401, url: '/api/expedientes' });

    await expect(firstValueFrom(interceptor(req, () => throwError(() => error401))))
      .rejects.toBe(error401);

    expect(authService.logout).toHaveBeenCalledOnce();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/expedientes/EXP-2026-0001' } },
    );
  });
});
