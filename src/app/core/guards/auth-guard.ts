import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core/primitives/di';

// Guard que protege rutas que requieren autenticación. Si el usuario no está autenticado,
// se le redirige a la página de login.
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.estaAutenticado();
};
