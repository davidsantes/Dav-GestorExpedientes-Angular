# Gestor de expedientes

Proyecto didactico para aprender Angular 22 con una aplicacion sencilla de gestion de expedientes. La app permite iniciar sesion, consultar un listado, aplicar filtros, navegar al detalle de un expediente y ver como se conectan componentes, rutas, servicios HTTP e interceptores.

## Que hace esta aplicacion

La aplicacion incluye:

- pantalla de login inicial
- layout comun con header y footer
- listado de expedientes con numero, titulo, estado, prioridad y fecha de alta
- filtros por numero, estado, prioridad y rango de fechas
- carga del listado mediante un servicio HTTP
- interceptor que simula una API de expedientes sin backend real
- estado de carga mientras se resuelve la consulta del listado
- navegacion al detalle de cada expediente
- paginacion visual simple en el listado
- pagina 404 para rutas no existentes
- routing con lazy loading para la feature de expedientes

## Arquitectura del proyecto

La estructura esta organizada por responsabilidades:

- `src/app/` contiene la configuracion principal de la aplicacion.
- `src/app/core/` contiene piezas comunes como header, footer, pagina 404 e interceptores.
- `src/app/core/interceptors/` contiene el interceptor mock de API.
- `src/app/features/login/` contiene el componente de login.
- `src/app/features/expedientes/` contiene la feature de expedientes.
- `src/app/features/expedientes/components/` contiene componentes reutilizables de la feature.
- `src/app/features/expedientes/pages/` contiene las paginas de listado y detalle.
- `src/app/features/expedientes/services/` contiene servicios de acceso a datos.
- `src/app/features/expedientes/models/` contiene interfaces y tipos del dominio.
- `src/app/features/expedientes/data/` contiene datos mock usados por la pagina de detalle.

## Conceptos de Angular que se practican

### 1. Componentes standalone

La app usa componentes standalone. Cada componente declara en `imports` los componentes, directivas o pipes que necesita.

Ejemplo en `src/app/features/expedientes/pages/expedientes-page/expedientes-page.ts`:

```ts
@Component({
  selector: 'app-expedientes-page',
  imports: [ExpedientesListadoFiltro, ExpedientesListado],
  templateUrl: './expedientes-page.html',
  styleUrl: './expedientes-page.css',
})
export class ExpedientesPage {}
```

Esto evita depender de un modulo principal para declarar componentes.

### 2. Routing y lazy loading

El enrutado principal esta en `src/app/app.routes.ts`.

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'expedientes',
    loadChildren: () => import('./features/expedientes/expedientes.routes').then(m => m.routes)
  },
  { path: '**', component: NotFoundPage },
];
```

La ruta `expedientes` carga de forma diferida las rutas definidas en `src/app/features/expedientes/expedientes.routes.ts`:

- `/expedientes` muestra el listado.
- `/expedientes/:numero` muestra el detalle.

Ademas, se usa `withComponentInputBinding()` en `src/app/app.config.ts`. Gracias a esto, los parametros de ruta y query params pueden recibirse como `input()` dentro de los componentes.

### 3. Formularios con ngModel

El componente de filtros usa `FormsModule` y `[(ngModel)]` para sincronizar los campos del formulario con el objeto `filtro`.

Ejemplo en `src/app/features/expedientes/components/expedientes-listado-filtro/expedientes-listado-filtro.html`:

```html
<input [(ngModel)]="filtro.numero" />
<select [(ngModel)]="filtro.estado"></select>
```

Cuando se pulsa buscar, el componente emite los filtros hacia la pagina padre con un output.

### 4. Inputs y outputs

La comunicacion entre componentes se hace con inputs y outputs.

El componente de filtros recibe listas de estados y prioridades:

```html
<app-expedientes-listado-filtro
  [estados]="estados"
  [prioridades]="prioridades"
  (filtrosAplicados)="aplicarFiltros($event)">
</app-expedientes-listado-filtro>
```

El componente de listado recibe los expedientes que debe pintar y emite el expediente seleccionado:

```html
<app-expedientes-listado
  [expedientes]="expedientes()"
  (expedienteSeleccionado)="seleccionarExpediente($event)">
</app-expedientes-listado>
```

### 5. Signals, computed y resource

La pagina de expedientes usa APIs modernas de Angular:

- `input()` para leer filtros desde la URL.
- `resource()` para lanzar una carga asincrona cuando cambian esos filtros.
- `computed()` para exponer al template un array de expedientes seguro.

Ejemplo en `src/app/features/expedientes/pages/expedientes-page/expedientes-page.ts`:

```ts
protected recursoExpedientes = resource({
  params: () => ({
    numero: this.numero(),
    estado: this.estado(),
    prioridad: this.prioridad(),
    fechaInicio: this.fechaInicio(),
    fechaFin: this.fechaFin(),
  }),
  loader: ({ params }) => firstValueFrom(this.expedientesService.getExpedientes(params)),
});

protected expedientes = computed<Expediente[]>(() => {
  return this.recursoExpedientes.value() ?? [];
});
```

Cuando cambian los query params de la URL, cambian los `input()`, se recalculan los `params` del `resource()` y se vuelve a llamar al servicio.

### 6. Estado de carga

`resource()` expone el estado de la carga con `isLoading()`.

En `src/app/features/expedientes/pages/expedientes-page/expedientes-page.html` se usa para mostrar un mensaje mientras se cargan los datos:

```html
@if (recursoExpedientes.isLoading()) {
  <section class="estado-carga" aria-live="polite">
    Cargando expedientes...
  </section>
} @else {
  <app-expedientes-listado
    [expedientes]="expedientes()"
    (expedienteSeleccionado)="seleccionarExpediente($event)">
  </app-expedientes-listado>
}
```

Esto permite que el usuario vea feedback cuando se aplica una busqueda o cambia algun filtro.

### 7. Servicios HTTP

El acceso al listado esta encapsulado en `src/app/features/expedientes/services/expedientes-service.ts`.

El servicio usa el decorador `@Service()` de Angular 22, `inject(HttpClient)` y devuelve `Observable`:

```ts
import { inject, Service } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Expediente } from '../models/expediente.interface';
import { FiltrosExpediente } from '../models/filtros-expediente.interface';

@Service()
export class ExpedientesService {
  private readonly httpClient = inject(HttpClient);

  getExpedientes(filtros: Partial<FiltrosExpediente>): Observable<Expediente[]> {
    let params = new HttpParams();

    if (filtros.numero) {
      params = params.set('numero', filtros.numero);
    }

    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }

    if (filtros.prioridad) {
      params = params.set('prioridad', filtros.prioridad);
    }

    if (filtros.fechaInicio) {
      params = params.set('fechaInicio', filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      params = params.set('fechaFin', filtros.fechaFin);
    }

    return this.httpClient.get<Expediente[]>('/api/expedientes', { params });
  }

  getExpediente(numero: string): Observable<Expediente> {
    return this.httpClient.get<Expediente>(
      `/api/expedientes/${encodeURIComponent(numero)}`
    );
  }
}
```

Aunque la URL sea `/api/expedientes`, no hay un servidor real detras. La peticion se resuelve mediante el interceptor mock.

### 8. Interceptores HTTP

El interceptor esta en `src/app/core/interceptors/mock-api-interceptor-interceptor.ts`.

Su funcion es interceptar peticiones HTTP hechas por `HttpClient` y devolver datos mock cuando la URL coincide con `/api/expedientes`.

```ts
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'GET' && req.url === '/api/expedientes') {
    return of(
      new HttpResponse({
        status: 200,
        body: expedientes
      })
    );
  }

  return next(req);
};
```

Tambien interpreta los query params que envia el servicio:

- `numero`
- `estado`
- `prioridad`
- `fechaInicio`
- `fechaFin`

Con esos parametros filtra el array `EXPEDIENTES_MOCK` antes de devolver la respuesta.

La ruta de detalle tambien esta contemplada en el interceptor:

```text
GET /api/expedientes/EXP-2026-0001
```

Si encuentra el expediente devuelve `200`; si no lo encuentra devuelve `404` con `body: null`.

### 9. Configuracion de HttpClient e interceptores

Para que `HttpClient` funcione en una aplicacion standalone, se registra en `src/app/app.config.ts` con `provideHttpClient()`.

En el mismo punto se conecta el interceptor con `withInterceptors()`:

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockApiInterceptor } from './core/interceptors/mock-api-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([mockApiInterceptor])
    )
  ]
};
```

Esta configuracion hace que todas las peticiones hechas con `HttpClient` pasen por `mockApiInterceptor`.

### 10. Directivas de template

La aplicacion usa la sintaxis moderna de control flow:

- `@if (...) { ... }` para mostrar contenido condicional.
- `@for (expediente of expedientes; track expediente.numero) { ... }` para pintar listas.

Ejemplos:

- `src/app/features/expedientes/pages/expedientes-page/expedientes-page.html`
- `src/app/features/expedientes/pages/expediente-detalle-page/expediente-detalle-page.html`
- `src/app/features/expedientes/components/expedientes-listado/expedientes-listado.html`

### 11. Interpolacion y property binding

La interpolacion muestra datos en el HTML:

```html
{{ expediente.titulo }}
{{ expediente.fechaAlta }}
```

El property binding enlaza valores del componente con propiedades o clases:

```html
<span
  class="badge estado"
  [class.pendiente]="expediente.estado === 'pendiente'"
  [class.tramite]="expediente.estado === 'tramite'">
  {{ expediente.estado }}
</span>
```

### 12. Event binding y navegacion

El event binding permite reaccionar a acciones del usuario:

```html
<button type="button" (click)="seleccionar(expediente)">
  Editar
</button>
```

La pagina de expedientes navega con `Router`:

```ts
seleccionarExpediente(expediente: Expediente): void {
  this.router.navigate(['/expedientes', expediente.numero]);
}
```

Los filtros tambien navegan, pero usando query params:

```ts
this.router.navigate(['/expedientes'], {
  queryParams: {
    numero: filtros?.numero || null,
    estado: filtros?.estado || null,
    prioridad: filtros?.prioridad || null,
    fechaInicio: filtros?.fechaInicio || null,
    fechaFin: filtros?.fechaFin || null,
  },
});
```

## Flujo de datos del listado

El listado ya no se alimenta filtrando un array local dentro de la pagina. Ahora el flujo es:

```text
Formulario de filtros
-> aplicarFiltros(...)
-> query params en la URL
-> input() en ExpedientesPage
-> resource()
-> ExpedientesService.getExpedientes(...)
-> HttpClient GET /api/expedientes
-> mockApiInterceptor
-> EXPEDIENTES_MOCK filtrado
-> app-expedientes-listado
```

Este patron es util para aprender como separar responsabilidades:

- el formulario solo recoge filtros
- la pagina coordina navegacion y estado
- el servicio conoce la API
- el interceptor simula el backend
- el listado solo pinta datos

## Modelo de expediente

El modelo principal esta en `src/app/features/expedientes/models/expediente.interface.ts`:

```ts
export interface Expediente {
  numero: string;
  titulo: string;
  estado: EstadoExpediente;
  prioridad: PrioridadExpediente;
  fechaAlta: string;
}
```

Los estados disponibles estan en `estado-expediente.type.ts`:

```ts
export type EstadoExpediente =
  | 'pendiente'
  | 'tramite'
  | 'finalizado'
  | 'archivado';
```

Las prioridades disponibles estan en `prioridad-expediente.type.ts`:

```ts
export type PrioridadExpediente =
  | 'alta'
  | 'media'
  | 'baja';
```

## Como arrancar el proyecto

Desde la raiz del proyecto:

```bash
npm install
npm start
```

En Windows PowerShell puede aparecer un bloqueo de ejecucion de scripts con `npm.ps1`. En ese caso usa `npm.cmd`:

```powershell
npm.cmd install
npm.cmd start
```

Luego abre la aplicacion en:

```text
http://localhost:4200/
```

Si el puerto `4200` esta ocupado, Angular preguntara si quieres usar otro puerto.

## Scripts utiles

```bash
npm start
npm run build
npm test
```

Tambien se puede usar Angular CLI directamente:

```bash
ng serve
ng build
ng test
```

En PowerShell, si `ng` o `npm` estan bloqueados por la politica de ejecucion, usa:

```powershell
npm.cmd run build
npm.cmd start
```

## Notas didacticas importantes

- `@Service()` es el decorador usado por Angular 22 para servicios auto-provistos.
- `HttpClient` no funciona por si solo: debe registrarse con `provideHttpClient()`.
- Los interceptores funcionales se registran con `withInterceptors([...])`.
- La URL `/api/expedientes` es ficticia: existe para que el servicio parezca real mientras el interceptor devuelve datos mock.
- `resource()` es apropiado para cargas de lectura. Para crear, modificar o borrar datos conviene usar otro flujo.
- El detalle de expediente todavia usa el mock local `src/app/features/expedientes/data/expedientes.mock.ts`; el listado usa el servicio HTTP y el interceptor.

## Objetivo didactico

Este proyecto sirve como base para practicar una aplicacion Angular moderna con:

- componentes standalone
- rutas normales y lazy loading
- formularios con `ngModel`
- inputs, outputs y comunicacion entre componentes
- signals y `computed()`
- `resource()` para lectura asincrona
- servicios HTTP con `HttpClient`
- interceptores funcionales
- separacion entre pagina, servicio, interceptor, modelo y componente de presentacion

El objetivo es entender el flujo completo de una pantalla realista: el usuario filtra, la URL refleja esos filtros, Angular recarga datos, el servicio hace una peticion HTTP y el interceptor mock responde como si hubiera un backend.
