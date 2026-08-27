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

- `header`: cabecera común.
- `footer`: pie común.
- `not-found-page`: página 404.
- `interceptors`: interceptor HTTP mock.

Son elementos que no pertenecen a una feature concreta, sino al marco general de la aplicación.

## `features`

`features` agrupa funcionalidades por dominio. En el código actual existen:

- `features/login`: pantalla de login.
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

El listado usa `getExpedientes`. La edición usa `actualizarExpediente`. El metodo `getExpediente` existe en el servicio y el interceptor lo soporta, aunque la página de detalle actual obtiene el expediente directamente desde `EXPEDIENTES_MOCK`.

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

`core/interceptors/mock-api-interceptor-interceptor.ts` intercepta peticiones a `/api/expedientes` y devuelve respuestas a partir de `EXPEDIENTES_MOCK`.

## ¿Por qué esta organizado así?

Interpretación basada en la implementacion: la estructura separa la aplicacion en capas simples para aprendizaje.

- `core` mantiene infraestructura común.
- `features` evita mezclar el dominio de expedientes con login o layout.
- `shared` permite extraer piezas reutilizables como paginación.
- `services` centraliza HTTP.
- `models` evita objetos sin tipo.
- `data` e `interceptors` permiten simular backend sin servidor real.
