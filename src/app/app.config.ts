import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockApiInterceptor } from './core/interceptors/mock-api-interceptor-interceptor';
import { authMockInterceptor } from './core/interceptors/auth-mock-interceptor';
import { authTokenInterceptor } from './core/interceptors/auth-token-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // Configuración del cliente HTTP con interceptores de tipo:
    // - authTokenInterceptor: añade el token de autenticación a las peticiones HTTP
    // - authMockInterceptor: simula la autenticación para pruebas
    // - mockApiInterceptor: simula respuestas de la API para pruebas
    provideHttpClient(withInterceptors([authTokenInterceptor, authMockInterceptor, mockApiInterceptor]))
  ]
};
