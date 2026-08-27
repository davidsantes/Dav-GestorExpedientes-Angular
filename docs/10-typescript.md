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

Los estados y prioridades se modelan como uniones de literales:

```ts
export type EstadoExpediente = 'pendiente' | 'tramite' | 'finalizado' | 'archivado';
```

```ts
export type PrioridadExpediente = 'alta' | 'media' | 'baja';
```

Esto limita los valores válidos durante compilacion.

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

`ExpedientesPage` declara listas de estados y prioridades:

```ts
protected estados: EstadoExpediente[] = [
  'pendiente',
  'tramite',
  'finalizado',
  'archivado',
];
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
