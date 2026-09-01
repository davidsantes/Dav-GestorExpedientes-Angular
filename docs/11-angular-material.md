# Angular Material

El proyecto incorpora Angular Material 22 para disponer de componentes accesibles y coherentes: formularios, botones, tabla, ordenación, paginación, tarjeta e interfaz de cabecera.

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
