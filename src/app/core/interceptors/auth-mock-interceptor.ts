import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';

import { Observable, delay, of, throwError } from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  Rol,
  TokenPayload,
} from '../../features/auth/models/auth.interface';

import { generarToken, leerToken } from '../auth/token.util';

const PREFIJO_API = 'https://dummyjson.com/';
const DURACION_SESION_MS = 15 * 60 * 1000;
const RETARDO_MS = 400;

interface UsuarioMock {
  user: string;
  pass: string;
  rol: Rol;
}

const USUARIOS: UsuarioMock[] = [
  { user: 'admin', pass: 'admin', rol: 'EDITOR' },
  { user: 'user', pass: 'user', rol: 'LECTOR' },
];

interface Permiso {
  patron: RegExp;
  metodos: string[];
  roles: Rol[];
}

const PERMISOS: Permiso[] = [
  // Listado/busqueda de expedientes: ambos roles
  {
    patron: /^\/api\/expedientes(?:\?.*)?$/,
    metodos: ['GET'],
    roles: ['LECTOR', 'EDITOR'],
  },

  // Detalle de expediente: solo EDITOR
  {
    patron: /^\/api\/expedientes\/[^/]+(?:\?.*)?$/,
    metodos: ['GET'],
    roles: ['EDITOR'],
  },

  // Escritura de expedientes: solo EDITOR
  {
    patron: /^\/api\/expedientes(?:\/[^/]+)?(?:\?.*)?$/,
    metodos: ['POST', 'PUT', 'PATCH', 'DELETE'],
    roles: ['EDITOR'],
  },
];

function responder<T>(
  body: T,
  status = 200
): Observable<HttpEvent<unknown>> {
  return of(new HttpResponse({ status, body })).pipe(delay(RETARDO_MS));
}

function error(
  status: number,
  mensaje: string,
  url: string
): Observable<HttpEvent<unknown>> {
  return throwError(
    () =>
      new HttpErrorResponse({
        status,
        statusText: mensaje,
        url,
        error: {
          status,
          message: mensaje,
        },
      })
  ).pipe(delay(RETARDO_MS));
}

function obtenerRuta(url: string): string {
  if (url.startsWith(PREFIJO_API)) {
    return '/' + url.substring(PREFIJO_API.length);
  }

  return url;
}

function rolesPermitidos(
  url: string,
  metodo: string
): Rol[] | null {
  const ruta = obtenerRuta(url);

  const regla = PERMISOS.find(
    (permiso) =>
      permiso.patron.test(ruta) &&
      permiso.metodos.includes(metodo)
  );

  return regla?.roles ?? null;
}

/**
 * Backend simulado de autenticación/autorización.
 */
export const authMockInterceptor: HttpInterceptorFn = (req, next) => {
  const url =
    req.url.startsWith(PREFIJO_API) ||
    req.url.startsWith('/api/')
      ? req.url
      : null;

  if (!url) {
    return next(req);
  }

  const metodo = req.method.toUpperCase();

  // LOGIN
  if (url === '/api/auth/login' && metodo === 'POST') {
    const credenciales = (req.body ?? {}) as Partial<LoginRequest>;

    const usuario = USUARIOS.find(
      (candidato) =>
        candidato.user === credenciales.user?.trim() &&
        candidato.pass === credenciales.pass
    );

    if (!usuario) {
      return error(
        401,
        'Usuario o contraseña incorrectos',
        url
      );
    }

    const payload: TokenPayload = {
      user: usuario.user,
      rol: usuario.rol,
      exp: Date.now() + DURACION_SESION_MS,
    };

    const respuesta: LoginResponse = {
      token: generarToken(payload),
      user: usuario.user,
      rol: usuario.rol,
    };

    return responder(respuesta);
  }

  // AUTENTICACIÓN
  const autorizacion =
    req.headers.get('Authorization') ?? '';

  const payload = leerToken(
    autorizacion.startsWith('Bearer ')
      ? autorizacion.slice(7)
      : null
  );

  if (!payload) {
    return error(
      401,
      'Sesión no válida o caducada',
      url
    );
  }

  // AUTORIZACIÓN
  const roles = rolesPermitidos(url, metodo);

  if (roles && !roles.includes(payload.rol)) {
    return error(
      403,
      `El rol ${payload.rol} no tiene permisos para ${metodo} ${url}`,
      url
    );
  }

  // PERFIL
  if (url === '/api/auth/perfil' && metodo === 'GET') {
    return responder({
      user: payload.user,
      rol: payload.rol,
    });
  }

  return next(req);
};
