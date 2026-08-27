# Angular moderno

Este proyecto usa varias APIs modernas de Angular 22. Los ejemplos proceden del código actual.

## Componentes standalone

Un componente standalone declara sus dependencias directamente en `imports`.

```ts
@Component({
  selector: 'app-expedientes-page',
  imports: [ExpedientesListadoFiltro, ExpedientesListado, ListadoPaginacion],
  templateUrl: './expedientes-page.html',
  styleUrl: './expedientes-page.css',
})
export class ExpedientesPage {}
```

Se utiliza en todos los componentes del proyecto.

## `input()`

`input()` declara entradas reactivas. En `ExpedientesPage` se usa para recibir query params gracias a `withComponentInputBinding()`:

```ts
numero = input('');
estado = input<EstadoExpediente | ''>('');
prioridad = input<PrioridadExpediente | ''>('');
fechaInicio = input('');
fechaFin = input('');
numeroPagina = input<number | string>();
```

También se usa en `ExpedienteDetallePage` para recibir `numero` y `modo`.

## `input.required()`

`ListadoPaginacion` requiere tres entradas:

```ts
itemsPorPagina = input.required<number>();
totalItems = input.required<number>();
itemsPrevios = input.required<number>();
```

Esto expresa que el componente necesita esos datos para calcular la página actual.

## `output()`

`output()` crea eventos que un componente hijo emite al padre.

```ts
filtrosAplicados = output<FiltrosExpediente | null>();
cambioPagina = output<number>();
expedienteSeleccionado = output<Expediente>();
```

Se usa para filtros, paginación y selección de expediente.

## `signal()`

`signal()` guarda estado reactivo local. En login:

```ts
loginModel = signal({
  usuario: '',
  password: '',
});
```

En detalle:

```ts
modeloEdicion = signal<ExpedienteForm>({
  numero: '',
  titulo: '',
  estado: 'tramite',
  prioridad: 'media',
  fechaAlta: '',
});
```

## `computed()`

`computed()` deriva valores a partir de otros valores reactivos.

En el listado:

```ts
protected expedientes = computed<Expediente[]>(() => {
  return this.respuestaExpedientes()?.data ?? [];
});
```

En el detalle:

```ts
esEdicion = computed(() => this.modo() === 'editar');
```

En paginación calcula página actual, primera página, total de páginas y última página.

## `effect()`

`ExpedienteDetallePage` usa `effect()` para copiar el expediente actual al modelo de edicion cuando cambia:

```ts
effect(() => {
  const expediente = this.expediente();

  if (expediente.numero) {
    this.modeloEdicion.set(this.aFormulario(expediente));
  }
});
```

## `rxResource()`

`rxResource()` conecta parámetros reactivos con un `Observable`. En `ExpedientesPage`, cuando cambian filtros o página, se vuelve a llamar al servicio:

```ts
protected recursoExpedientes = rxResource({
  params: () => ({
    numero: this.numero(),
    estado: this.estado(),
    prioridad: this.prioridad(),
    fechaInicio: this.fechaInicio(),
    fechaFin: this.fechaFin(),
    numeroPagina: this.numeroPagina(),
  }),
  stream: ({ params }) =>
    this.expedientesService.getExpedientes(
      {
        numero: params.numero,
        estado: params.estado,
        prioridad: params.prioridad,
        fechaInicio: params.fechaInicio,
        fechaFin: params.fechaFin,
      },
      (this.normalizarNumeroPagina(params.numeroPagina) - 1) *
        this.resultadosPorPagina,
      this.resultadosPorPagina,
    ),
});
```

## Control flow moderno

Las plantillas usan `@if` y `@for`:

```html
@if (recursoExpedientes.isLoading()) {
<section class="estado-carga">Cargando expedientes...</section>
} @else {
<app-expedientes-listado [expedientes]="expedientes()" />
}
```

```html
@for (expediente of expedientes; track expediente.numero) {
<tr>
  ...
</tr>
}
```

## `@Service()`

El servicio de expedientes usa el decorador `@Service()`:

```ts
@Service()
export class ExpedientesService {
  private readonly httpClient = inject(HttpClient);
}
```

En este proyecto se usa para declarar el servicio que encapsula llamadas HTTP.
