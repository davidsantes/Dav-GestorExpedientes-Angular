import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  function configureGuard(autenticado: boolean): void {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { estaAutenticado: () => autenticado } },
      ],
    });
  }

  it('permite entrar cuando existe una sesion autenticada', () => {
    configureGuard(true);

    expect(executeGuard({} as never, {} as never)).toBe(true);
  });

  it('bloquea la ruta cuando no hay sesion autenticada', () => {
    configureGuard(false);

    expect(executeGuard({} as never, {} as never)).toBe(false);
  });
});
