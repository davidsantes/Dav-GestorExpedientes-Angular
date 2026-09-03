# Arquitectura

La aplicación esta organizada por responsabilidad y por dominio. No hay módulos Angular tradicionales: los componentes son standalone y declaran sus dependencias en `imports`.

## Estructura de `src/app`

```text
src/app/
|-- core/
|-- features/
|-- shared/
|-- app.config.ts
|-- app.routes.ts
|-- app.html
|-- app.css
`-- app.ts
```

## `core`

`core` agrupa piezas transversales de la aplicación:

- `layout`: cabecera, pie y página 404 comunes.
- `services`: servicios de infraestructura, incluido `AuthService`.
- `guards`: protección de rutas por autenticación y rol.
- `interceptors`: gestión del token y simulación de la API.

Son elementos que no pertenecen a una feature concreta, sino al marco general de la aplicación.

`core/layout` contiene:

- `header`: cabecera común.
- `footer`: pie común.
- `not-found-page`: página 404.

`AuthService` conserva la sesión, expone el estado de autenticación y determina si el usuario tiene el rol `EDITOR`. Los guards consumen ese servicio: `authGuard` exige una sesión y `rolGuard` exige el rol de editor.

## `features`

`features` agrupa funcionalidades por dominio. En el código actual existen:

- `features/auth`: autenticación, con el componente `components/login` y sus modelos.
- `features/expedientes`: listado, consulta y edición de expedientes.

La feature de expedientes tiene su propio archivo de rutas, `expedientes.routes.ts`, que se carga con lazy loading desde `app.routes.ts`.

## `shared`

`shared` contiene piezas reutilizables entre features. Actualmente incluye:

- `shared/components/listado-paginacion`: componente de paginación usado por el listado de expedientes.

## `pages` y `components`

Dentro de `features/expedientes` se distingue entre:

- `pages`: componentes conectados a rutas y responsables de coordinar estado, navegación y servicios.
- `components`: componentes de UI usados por una página.

`ExpedientesPage` es una página; `ExpedientesListadoFiltro` y `ExpedientesListado` son componentes hijos. `ExpedienteDetallePage` tambien es una página porque se asigna directamente a rutas.

## `services`

`features/expedientes/services/expedientes-service.ts` encapsula el acceso HTTP. Expone:

- `getExpedientes(...)`
- `getExpediente(numero)`
- `actualizarExpediente(expediente)`

El listado usa `getExpedientes`. La página de detalle usa `getExpediente`. La edición usa `actualizarExpediente`.

## `models`

`features/expedientes/models` contiene los tipos del dominio:

- `Expediente`
- `ExpedienteForm`
- `FiltrosExpediente`
- `ExpedientesListadoRespuesta`
- `EstadoExpediente`
- `PrioridadExpediente`

Estos modelos hacen explícita la forma de los datos que pasan entre componentes, servicio e interceptor.

## `data`

`features/expedientes/data/expedientes.mock.ts` contiene `EXPEDIENTES_MOCK`, el array en memoria usado como dataset de expedientes.

## `interceptors`

Los interceptores registrados en `app.config.ts` son:

- `auth-token-interceptor.ts`: añade el token de sesión a la cabecera `Authorization` y, ante un `401`, cierra sesión y redirige al login.
- `auth-mock-interceptor.ts`: simula el login, los roles y las respuestas de autorización.
- `mock-api-interceptor-interceptor.ts`: intercepta peticiones a `/api/expedientes` y devuelve respuestas a partir de `EXPEDIENTES_MOCK`.

## ¿Por qué esta organizado así?

Interpretación basada en la implementacion: la estructura separa la aplicacion en capas simples para aprendizaje.

- `core` mantiene infraestructura común.
- `features` evita mezclar los dominios de expedientes y autenticación con el layout común.
- `shared` permite extraer piezas reutilizables como paginación.
- `services` centraliza HTTP.
- `models` evita objetos sin tipo.
- `data` e `interceptors` permiten simular backend sin servidor real.
