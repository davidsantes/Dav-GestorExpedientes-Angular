# 📁 Gestor de expedientes

Proyecto de ejemplo para aprender Angular en un curso de iniciación. La aplicación simula una pequeña gestión documental donde el usuario puede visualizar expedientes, filtrarlos, navegar entre listado y detalle y entender cómo funciona la estructura de una app Angular moderna.

## 🔎 ¿Qué hace esta aplicación?

La app incluye:

- pantalla de login inicial
- listado de expedientes con información básica
- filtros por número, estado, prioridad y rango de fechas
- navegación a detalle de cada expediente
- paginación simple del listado
- página de error 404 para rutas no existentes
- layout con header y footer
- ejemplo de routing con lazy loading

## 🏗️ Arquitectura del proyecto

La estructura está organizada por capas y features:

- `src/app/` → aplicación principal
- `src/app/core/` → header, footer y página de error
- `src/app/features/login/` → componente de login
- `src/app/features/expedientes/` → listado, filtros, detalle y rutas de expedientes
- `src/app/data/` → datos mock de expedientes
- `src/app/models/` → tipos e interfaces del dominio

## 🧠 Conceptos de Angular que se practican

### 1. 🧩 Componentes standalone

La app usa componentes standalone, que se importan directamente en el metadata de cada componente.

Ejemplo: `src/app/app.ts`

```ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
```

Esto permite crear componentes más modulares y reutilizables sin depender de un módulo principal.

### 2. 📝 Interpolación

Se usa para mostrar valores del componente dentro del HTML:

- `{{ expediente.titulo }}`
- `{{ expediente().numero }}`
- `{{ expediente().estado }}`

Ejemplos en:

- `src/app/features/expedientes/components/expedientes-listado/expedientes-listado.html`
- `src/app/features/expedientes/pages/expediente-detalle-page/expediente-detalle-page.html`

### 3. 🔗 Property binding

Se usa para enlazar valores del componente a propiedades del DOM o clases CSS.

Ejemplos:

- `[value]="estado"` para rellenar opciones del select
- `[class.pendiente]="expediente.estado === 'pendiente'"`
- `[class.finalizado]="expediente().estado === 'finalizado'"`

Estos ejemplos están en:

- `src/app/features/expedientes/components/expedientes-listado-filtro/expedientes-listado-filtro.html`
- `src/app/features/expedientes/components/expedientes-listado/expedientes-listado.html`
- `src/app/features/expedientes/pages/expediente-detalle-page/expediente-detalle-page.html`

### 4. 🖱️ Event binding

Se escucha la interacción del usuario y se dispara lógica del componente.

Ejemplos:

- `(click)="login()"`
- `(click)="limpiar()"`
- `(click)="seleccionar(expediente)"`
- `(click)="volver()"`

Archivos clave:

- `src/app/features/login/components/login/login.html`
- `src/app/features/expedientes/components/expedientes-listado-filtro/expedientes-listado-filtro.html`
- `src/app/features/expedientes/components/expedientes-listado/expedientes-listado.html`

### 5. 🔄 Two-way binding con ngModel

El formulario de filtros usa `[(ngModel)]` para sincronizar el modelo del componente con el formulario.

```html
<input [(ngModel)]="filtro.numero" />
<select [(ngModel)]="filtro.estado"></select>
```

Esto se observa en:

- `src/app/features/expedientes/components/expedientes-listado-filtro/expedientes-listado-filtro.html`

Es un ejemplo clásico para aprender cómo Angular mantiene actualizado el estado del formulario.

### 6. 🔁 Directivas estructurales

La aplicación hace uso de directivas para renderizado condicional y listas:

- `@if (...) { ... }` para mostrar contenido según la existencia del expediente
- `@for (expediente of expedientes; track expediente.numero) { ... }` para recorrer la colección

Ejemplos:

- `src/app/features/expedientes/pages/expediente-detalle-page/expediente-detalle-page.html`
- `src/app/features/expedientes/components/expedientes-listado/expedientes-listado.html`

### 7. 🧭 Routing y navegación

El enrutado principal está definido en `src/app/app.routes.ts`:

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

Y las rutas de expedientes están en:

- `src/app/features/expedientes/expedientes.routes.ts`

Incluye:

- `/expedientes` → listado
- `/expedientes/:numero` → detalle del expediente
- `loadChildren` para lazy loading

También se usa `router-outlet` en `src/app/app.html` y `routerLink` en la página de error.

### 8. ⚡ Signals y estado reactivo

La app usa `signal()` y `computed()` para trabajar con estado reactivo en un estilo moderno de Angular.

Ejemplo:

```ts
protected expedientes: Signal<Expediente[]> = computed(() => {
  // lógica de filtrado
});
```

Se ve en:

- `src/app/features/expedientes/pages/expedientes-page/expedientes-page.ts`
- `src/app/app.ts`

## 🚀 Flujo de la aplicación

1. El usuario entra en la ruta raíz y se redirige a `/login`.
2. La vista de login permite iniciar sesión.
3. Tras la navegación, se accede al listado de expedientes.
4. El formulario de filtros modifica el estado del componente con `ngModel`.
5. La lista se actualiza según los filtros.
6. El usuario puede seleccionar un expediente y navegar a su detalle específico.
7. El sistema muestra una vista de error si la ruta no existe.

## ▶️ Cómo arrancar el proyecto

Desde la raíz del proyecto:

```bash
npm install
npm start
```

Y luego abre la aplicación en el navegador en:

```text
http://localhost:4200/
```

## 🛠️ Scripts útiles

```bash
ng serve
ng build
ng test
```

## 🎯 Objetivo didáctico

Este proyecto sirve como ejemplo práctico para estudiar una app Angular realista con:

- componentes reutilizables
- templates con bindings y directivas
- formularios reactivos y de template
- configuración de rutas
- navegación con parámetros
- lazy loading
- uso de señales para la gestión del estado

Es una buena base para empezar a comprender el flujo de Angular y cómo se estructura una aplicación de tamaño medio.
