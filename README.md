# Gestor de expedientes

Proyecto didactico para aprender Angular 22 con una aplicacion sencilla de gestion de expedientes. La app permite iniciar sesion, consultar un listado, aplicar filtros, navegar al detalle de un expediente y editar algunos de sus datos usando una API mock.

## Objetivo

Servir como base de aprendizaje para ver, en una aplicacion pequena pero completa, como se relacionan componentes standalone, rutas, formularios, signals, `rxResource`, servicios HTTP e interceptores.

## Funcionalidades

- Pantalla de login con validacion mediante Signal Forms.
- Layout comun con header, contenido principal y footer.
- Listado de expedientes con numero, titulo, estado, prioridad y fecha de alta.
- Filtros por numero, estado, prioridad y rango de fechas.
- Paginacion simple del listado.
- Consulta del detalle de un expediente.
- Edicion de titulo, estado, prioridad y fecha de alta.
- Guardado de cambios contra una API mock interceptada en memoria.
- Pagina 404 para rutas no existentes.
- Lazy loading para la feature de expedientes.

## Tecnologias

- Angular 22
- TypeScript
- RxJS
- Angular Signal Forms
- Angular Router
- Angular HttpClient
- CSS
- Vitest/jsdom para tests unitarios

## Instalacion y ejecucion

Desde la raiz del proyecto:

```bash
npm install
npm start
```

La aplicacion queda disponible normalmente en:

```text
http://localhost:4200/
```

En Windows PowerShell puede aparecer un bloqueo de ejecucion de scripts con `npm.ps1`. En ese caso usa `npm.cmd`:

```powershell
npm.cmd install
npm.cmd start
```

## Comandos habituales

```bash
npm run build
npm test
ng serve
ng build
ng test
```

Para generar elementos con Angular CLI:

```bash
ng generate component nombre-componente
ng generate service nombre-servicio
```

## Estructura general

```text
src/app/
|-- core/
|   |-- footer/
|   |-- header/
|   |-- interceptors/
|   `-- not-found-page/
|-- features/
|   |-- expedientes/
|   `-- login/
|-- shared/
|   `-- components/
|-- app.config.ts
|-- app.routes.ts
`-- app.ts
```

## Arquitectura en breve

La aplicacion separa piezas transversales en `core`, funcionalidades por dominio en `features` y componentes reutilizables en `shared`. La feature de expedientes concentra sus paginas, componentes, servicio HTTP, modelos y datos mock.

La documentacion tecnica y didactica esta en [docs/README.md](docs/README.md).

## Recursos oficiales

- [Angular](https://angular.dev/)
- [Inyeccion de dependencias en Angular](https://angular.dev/essentials/dependency-injection)
- [RxJS](https://rxjs.dev/guide/overview)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
