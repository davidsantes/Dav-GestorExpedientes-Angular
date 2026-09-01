# TypeScript

Este documento recoge solo características de TypeScript que aparecen en el proyecto.

## Interfaces

Una `interface` describe la forma de un objeto.

`Expediente`:

```ts
export interface Expediente {
  numero: string;
  titulo: string;
  estado: EstadoExpediente;
  prioridad: PrioridadExpediente;
  fechaAlta: string;
}
```

`FiltrosExpediente`:

```ts
export interface FiltrosExpediente {
  numero: string;
  estado: EstadoExpediente | '';
  prioridad: PrioridadExpediente | '';
  fechaInicio: string;
  fechaFin: string;
}
```

`ExpedientesListadoRespuesta`:

```ts
export interface ExpedientesListadoRespuesta {
  data: Expediente[];
  total: number;
  skip: number;
  limit: number;
}
```

## `type` y union types

Los estados y prioridades se declaran como constantes de valores válidos. `as const` conserva cada literal y permite derivar los tipos desde los datos:

```ts
export const ESTADOS_EXPEDIENTE = [
  'pendiente',
  'tramite',
  'finalizado',
  'archivado',
] as const;

export type EstadoExpediente = (typeof ESTADOS_EXPEDIENTE)[number];
```

```ts
export const PRIORIDADES_EXPEDIENTE = ['alta', 'media', 'baja'] as const;

export type PrioridadExpediente = (typeof PRIORIDADES_EXPEDIENTE)[number];
```

Esto limita los valores válidos durante compilación y proporciona las listas que usan los filtros y el formulario de edición.

## Union con cadena vacia

Los filtros permiten valor vacío para representar "sin filtro":

```ts
estado: EstadoExpediente | '';
prioridad: PrioridadExpediente | '';
```

## Arrays tipados

El mock declara un array de expedientes:

```ts
export const EXPEDIENTES_MOCK: Expediente[] = [...]
```

`ExpedientesPage` reutiliza las listas compartidas:

```ts
protected readonly estados = ESTADOS_EXPEDIENTE;
protected readonly prioridades = PRIORIDADES_EXPEDIENTE;
```

## Genéricos

El proyecto usa genéricos para indicar el tipo de datos de APIs Angular y TypeScript.

Inputs:

```ts
estado = input<EstadoExpediente | ''>('');
itemsPorPagina = input.required<number>();
```

Signals:

```ts
modeloEdicion = signal<ExpedienteForm>({...});
```

Computed:

```ts
protected expedientes = computed<Expediente[]>(() => {
  return this.respuestaExpedientes()?.data ?? [];
});
```

HTTP:

```ts
this.httpClient.get<ExpedientesListadoRespuesta>('/api/expedientes', { params });
```

## `Partial`

`getExpedientes` acepta filtros parciales:

```ts
getExpedientes(
  filtros: Partial<FiltrosExpediente>,
  skip = 0,
  limit = 30,
): Observable<ExpedientesListadoRespuesta>
```

`Partial<FiltrosExpediente>` permite enviar solo algunos campos de filtro.

## Tipos de retorno

Varios metodos declaran retorno:

```ts
aplicarFiltros(filtros: FiltrosExpediente | null): void
cambioPagina(pagina: number): void
guardar(): Promise<void>
getExpedientes(...): Observable<ExpedientesListadoRespuesta>
```

Esto ayuda a leer si una funcion devuelve datos, navega, emite eventos o resuelve una operacion asincrona.

## Type-only imports

El interceptor importa algunos tipos con `import type`:

```ts
import type { ExpedientesListadoRespuesta } from '../../features/expedientes/models/expedientes-listado-respuesta.interface';
import type { Expediente } from '../../features/expedientes/models/expediente.interface';
```

`import type` indica que esas importaciones se usan solo para tipado.
