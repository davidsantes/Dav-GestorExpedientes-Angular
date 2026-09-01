# Gestor de expedientes

Proyecto didáctico para aprender Angular 22 con una aplicación sencilla de gestión de expedientes. La app permite iniciar sesión, consultar un listado, aplicar filtros, navegar al detalle de un expediente y editar algunos de sus datos usando una API mock.

## Objetivo

Servir como base de aprendizaje para ver, en una aplicación pequeña pero completa, cómo se relacionan componentes standalone, rutas, formularios, signals, `rxResource`, servicios HTTP e interceptores.

## Funcionalidades

- Pantalla de login con validación mediante Signal Forms.
- Layout común con header, contenido principal y footer.
- Listado de expedientes con número, título, estado, prioridad y fecha de alta.
- Filtros por número, estado, prioridad y rango de fechas.
- Paginación simple del listado.
- Consulta del detalle de un expediente.
- Edición de título, estado, prioridad y fecha de alta.
- Guardado de cambios contra una API mock interceptada en memoria.
- Página 404 para rutas no existentes.
- Lazy loading para la feature de expedientes.

## Tecnologías

- Angular 22
- TypeScript
- RxJS
- Angular Signal Forms
- Angular Router
- Angular HttpClient
- Angular Material
- CSS
- Vitest/jsdom para tests unitarios

## Instalación y ejecución

Desde la raíz del proyecto:

```bash
npm install
npm start
```

La aplicaciín queda disponible normalmente en:

```text
http://localhost:4200/
```

En Windows PowerShell puede aparecer un bloqueo de ejecución de scripts con `npm.ps1`. En ese caso usa `npm.cmd`:

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

La aplicación separa piezas transversales en `core`, funcionalidades por dominio en `features` y componentes reutilizables en `shared`. La feature de expedientes concentra sus páginas, componentes, servicio HTTP, modelos y datos mock.

La documentación técnica y didáctica esta en [docs/README.md](docs/README.md).

## Recursos oficiales

- [Angular](https://angular.dev/)
- [Inyeccion de dependencias en Angular](https://angular.dev/essentials/dependency-injection)
- [RxJS](https://rxjs.dev/guide/overview)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Material Design: reglas y sistema de diseño](https://m3.material.io/)
- [Angular Material: cómo aplicar Material Design](https://material.angular.dev/)
- [Angular Material: Iconos](https://www.angularjswiki.com/angular/angular-material-icons-list-mat-icon-list/)
