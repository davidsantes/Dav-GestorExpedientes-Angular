import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core/primitives/di';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Router } from '@angular/router';

// Interceptor que añade el token de autenticación a las peticiones HTTP
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.session()?.token;
  const router = inject(Router);
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(authReq).pipe(
    catchError((error:HttpErrorResponse) => {
      if (error.status === 401) {
        const urlActual = router.url;
        authService.logout();
        router.navigate(['/login'], { queryParams: { returnUrl: urlActual } });
      }

      throw error;
    })
  );
};
