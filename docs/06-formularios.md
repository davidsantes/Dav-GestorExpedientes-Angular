# Formularios

El proyecto usa dos enfoques de formularios:

- `ngModel` para los filtros del listado.
- Signal Forms para login y edición de expediente.

## Formulario de filtros

Archivo principal: `src/app/features/expedientes/components/expedientes-listado-filtro`.

El componente importa `FormsModule`:

```ts
@Component({
  imports: [FormsModule],
})
export class ExpedientesListadoFiltro {}
```

El estado del formulario es un objeto normal:

```ts
protected filtro: FiltrosExpediente = {
  numero: '',
  estado: '',
  prioridad: '',
  fechaInicio: '',
  fechaFin: '',
};
```

La plantilla usa `[(ngModel)]`:

```html
<input name="numero" type="search" [(ngModel)]="filtro.numero" />
<select name="estado" [(ngModel)]="filtro.estado"></select>
<select name="prioridad" [(ngModel)]="filtro.prioridad"></select>
<input name="fechaInicio" type="date" [(ngModel)]="filtro.fechaInicio" />
<input name="fechaFin" type="date" [(ngModel)]="filtro.fechaFin" />
```

Al buscar, el componente emite una copia de los filtros:

```ts
buscar(): void {
  this.filtrosAplicados.emit({
    ...this.filtro,
  });
}
```

Al limpiar, reinicia el objeto y emite `null`.

## Formulario de login

Archivo principal: `src/app/features/login/components/login`.

El login usa Signal Forms:

```ts
loginModel = signal({
  usuario: '',
  password: '',
});

loginForm = form(this.loginModel, (schemaPath) => {
  required(schemaPath.usuario, { message: 'El usuario es obligatorio' });
  required(schemaPath.password, { message: 'La contrasena es obligatoria' });
});
```

La plantilla conecta controles nativos con `[formField]`:

```html
<input id="usuario" type="text" [formField]="loginForm.usuario" />
<input id="password" type="password" [formField]="loginForm.password" />
```

La validación se muestra cuando el campo esta tocado e inválido:

```html
@if (loginForm.usuario().touched() && loginForm.usuario().invalid()) { @for (error of
loginForm.usuario().errors(); track error) {
<p class="error-message">{{ error.message }}</p>
} }
```

El botón se deshabilita con:

```html
[disabled]="loginForm().invalid()"
```

La acción de login no comprueba credenciales reales; navega a `/expedientes`.

## Formulario de edición de expediente

Archivo principal: `src/app/features/expedientes/pages/expediente-detalle-page`.

El modelo de edición es un signal tipado:

```ts
modeloEdicion = signal<ExpedienteForm>({
  numero: '',
  titulo: '',
  estado: 'tramite',
  prioridad: 'media',
  fechaAlta: null,
});
```

El formulario declara validaciones obligatorias:

```ts
formularioEdicion = form(this.modeloEdicion, (schemaPath) => {
  required(schemaPath.titulo, { message: 'El titulo es obligatorio' });
  required(schemaPath.fechaAlta, { message: 'La fecha de alta es obligatoria' });
});
```

La plantilla usa `[formField]` en `estado`, `titulo`, `prioridad` y `fechaAlta`. El número se muestra como `readonly` usando `[value]="expediente().numero"`.

`fechaAlta` es `Date | null` dentro de `ExpedienteForm`, para que `MatDatepicker` pueda mostrar el día ya guardado al abrir el calendario. El formulario convierte entre ese valor y la cadena `YYYY-MM-DD` que usa `Expediente` al leer y guardar.

```html
<mat-form-field appearance="outline">
  <mat-label>Fecha de alta</mat-label>
  <input matInput [matDatepicker]="selectorFechaAlta" [formField]="formularioEdicion.fechaAlta">
  <mat-datepicker-toggle matIconSuffix [for]="selectorFechaAlta"></mat-datepicker-toggle>
  <mat-datepicker #selectorFechaAlta></mat-datepicker>
  @if (formularioEdicion.fechaAlta().invalid()) {
    <mat-error>La fecha de alta es obligatoria</mat-error>
  }
</mat-form-field>
```

Al borrar la fecha, el valor pasa a `null` y la validación `required(...)` muestra el error.

Al guardar:

```ts
async guardar(): Promise<void> {
  if (this.formularioEdicion().invalid()) {
    return;
  }

  await firstValueFrom(
    this.expedientesService.actualizarExpediente(
      this.aExpediente(this.modeloEdicion()),
    ),
  );
  await this.volver();
}
```

## Diferencia entre enfoques

`ngModel` se usa para un formulario simple de filtros, sin validación declarada. Signal Forms se usa donde hay validación y estado reactivo de formulario: login y edición.

Interpretación basada en la implementación: esto permite mostrar en el mismo proyecto dos formas de trabajar formularios en Angular, una mas directa para filtros, y otra más estructurada para validaciones.
