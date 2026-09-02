import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { rolGuard } from './rol-guard';

describe('rolGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => rolGuard(...guardParameters));

  function configureGuard(esEditor: boolean): void {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { esUsuarioEditor: () => esEditor } }
      ]
    });
  }

  it('permite acceder a un editor', () => {
    configureGuard(true);

    expect(executeGuard({} as never, {} as never)).toBe(true);
  });

  it('deniega el acceso a un lector', () => {
    configureGuard(false);

    expect(executeGuard({} as never, {} as never)).toBe(false);
  });
});
