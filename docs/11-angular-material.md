# Angular Material

Angular Material implementa Material Design, el sistema de diseño de Google para crear interfaces coherentes, intuitivas y accesibles. El proyecto incorpora Angular Material 22 para disponer de componentes de formulario, botones, tabla, ordenación, paginación, tarjeta y barra de herramientas.

Material Design aporta criterios de color, tipografía, accesibilidad, elevación y animación. La aplicación utiliza el tema de Material junto con sus propias variables CSS institucionales.

## Instalación y tema

La dependencia se añadió con Angular CLI:

```bash
ng add @angular/material
```

El archivo `src/material-theme.scss` se registra antes de `src/styles.css` en `angular.json`. Define un tema Material 3 claro con paleta roja primaria y cian terciaria:

```scss
@use '@angular/material' as mat;

html {
	@include mat.theme(
		(
			color: (
				primary: mat.$red-palette,
				tertiary: mat.$cyan-palette,
			),
			typography: Roboto,
			density: 0,
		)
	);
}
```

Los tokens propios de `src/styles.css` complementan ese tema con los colores institucionales de la aplicación. Los componentes Material reciben sus colores y estados desde el tema.

El comando siguiente puede generar paletas personalizadas a partir de un color:

```bash
ng generate @angular/material:theme-color --primary-color "#c8102e"
```

El archivo `_theme-colors.scss` actual fue generado con `#ffffff` como color primario. No se importa desde `src/material-theme.scss`, por lo que no interviene en el tema activo. Para utilizar una paleta generada, hay que importarla desde `material-theme.scss` y usar sus paletas en la configuración de `mat.theme()`.

## Importaciones en componentes standalone

Cada componente importa únicamente los módulos Material que usa. Por ejemplo, el login combina Signal Forms con tarjeta, campos y botón Material:

```ts
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
	imports: [FormField, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
})
export class Login {}
```

## Login y campos de formulario

El formulario de inicio de sesión usa `mat-card`, `mat-form-field`, `matInput` y un botón de acción principal. `formField` sigue siendo responsable del enlace con Signal Forms:

```html
<mat-card class="login-card">
	<p class="eyebrow">Acceso al portal</p>
	<h1>Iniciar sesión</h1>

	<mat-form-field appearance="outline">
		<mat-label>Usuario</mat-label>
		<input id="usuario" matInput type="text" [formField]="loginForm.usuario">
	</mat-form-field>

	<button matButton="filled" type="button" [disabled]="loginForm().invalid()">
		Iniciar sesión
	</button>
</mat-card>
```

## Filtros y edición

Los filtros y el detalle en modo edición usan el mismo patrón. Los campos de selección se crean con `mat-select` y las opciones se recorren con `@for`.

```html
<mat-form-field appearance="outline">
	<mat-label>Estado</mat-label>
	<mat-select id="estado" [formField]="formularioEdicion.estado">
		@for (estado of estados; track estado) {
			<mat-option [value]="estado">{{ estado }}</mat-option>
		}
	</mat-select>
</mat-form-field>
```

`estados` y `prioridades` proceden de `ESTADOS_EXPEDIENTE` y `PRIORIDADES_EXPEDIENTE`, definidas junto a sus tipos en `models`. Así, los criterios de búsqueda y los valores editables comparten una única fuente de datos.

## Tabla y ordenación

El listado usa `MatTableModule`, `MatSortModule` y `MatIconModule`. Las cabeceras ordenables llevan `mat-sort-header`; el evento se ordena localmente sin modificar el array recibido por el componente.

```html
<table mat-table [dataSource]="expedientesOrdenados()" matSort (matSortChange)="ordenar($event)">
	<ng-container matColumnDef="titulo">
		<th mat-header-cell *matHeaderCellDef mat-sort-header="titulo">
			<mat-icon aria-hidden="true">subject</mat-icon>
			<span>Título</span>
		</th>
		<td mat-cell *matCellDef="let expediente">{{ expediente.titulo }}</td>
	</ng-container>
</table>
```

La implementación conserva el orden original cuando el usuario limpia la ordenación:

```ts
if (!orden.direction) {
	this.expedientesOrdenados.set(expedientes);
	return;
}
```

Las flechas de ordenación se muestran en blanco para contrastar con el encabezado granate.

## Paginación y cabecera

`MatPaginatorModule` controla la paginación del listado. El componente adapta su evento `PageEvent` al número de página que consume la página de expedientes:

```html
<mat-paginator
	[length]="totalItems()"
	[pageIndex]="paginaActual() - 1"
	[pageSize]="itemsPorPagina()"
	[hidePageSize]="true"
	[showFirstLastButtons]="true"
	(page)="navegarAPagina($event)">
</mat-paginator>
```

La cabecera de la aplicación usa `MatToolbarModule`:

```html
<mat-toolbar>
	<h1>{{ titulo }}</h1>
	<nav aria-label="Navegación principal">
		<a routerLink="/expedientes">Expedientes</a>
	</nav>
</mat-toolbar>
```

## Estilos propios y Material

Los estilos de cada vista mantienen el layout, los espacios y los colores de marca. No deben aplicarse selectores genéricos como `button`, `input` o `select` sobre componentes Material, porque pueden modificar los elementos anfitrión. En su lugar, se usan selectores concretos como `mat-form-field`, `table.mat-mdc-table` y `th.mat-mdc-header-cell`.

Para ajustar elementos internos encapsulados por Material, como la flecha de ordenación, el listado emplea una regla localizada con `::ng-deep`:

```css
::ng-deep th.mat-mdc-header-cell .mat-sort-header-container,
::ng-deep th.mat-mdc-header-cell .mat-sort-header-arrow {
	color: #ffffff;
}
```

Se limita a la tabla del listado para no afectar otros componentes Material.

## Feedback al usuario

Como guía para futuros flujos de la aplicación, se recomienda elegir el mecanismo de feedback según el tipo de mensaje:

- **Validación de un campo**: `MatError` dentro de su `mat-form-field`.
- **Éxito o fallo de una acción no bloqueante:** `MatSnackBar`.
- **Confirmación importante:** `MatDialog`.
- **Error bloqueante:** `MatDialog`.
- **Información persistente o contextual:** mensaje dentro de la página.
- **Carga o proceso:** `MatProgressSpinner` o `MatProgressBar`.

La guía no implica que todos estos componentes estén implementados. Cada uno se añadirá cuando un flujo concreto lo requiera, importando únicamente su módulo en el componente correspondiente.

## Recursos

- [Material Design](https://m3.material.io/)
- [Angular Material](https://material.angular.dev/)
- [Iconos de Material](https://fonts.google.com/icons)
