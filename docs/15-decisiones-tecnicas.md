# Decisiones técnicas

Este documento distingue entre decisiones documentadas en el código/README anterior e interpretaciones basadas en la implementacion actual.

## Decisiones documentadas

### Usar lazy loading en expedientes

El README anterior indicaba lazy loading para la feature de expedientes, y el código lo confirma:

```ts
{
  path: 'expedientes',
  loadChildren: () =>
    import('./features/expedientes/expedientes.routes').then(m => m.routes),
}
```

### Usar query params para filtros

El README anterior explicaba que los filtros se guardan como query params. El código lo hace en `aplicarFiltros` y `cambioPagina`.

### Usar un interceptor mock

El README anterior indicaba que no hay backend real y que `/api/expedientes` se resuelve mediante `mockApiInterceptor`. El código registra el interceptor con `withInterceptors([mockApiInterceptor])`.

### Usar Signal Forms

El README anterior documentaba Signal Forms para login y edición. El código usa:

```ts
import { form, FormField, required } from '@angular/forms/signals';
```

## Interpretaciones basadas en la implementacion

### Por qué se usa `rxResource`

`rxResource` encaja con el listado porque la carga depende de parametros reactivos: filtros y página. Cuando cambia la URL, cambian los inputs, se recalculan los params y se relanza la peticion.

No se usa para guardar cambios. La edición llama al servicio y convierte el `Observable` a promesa con `firstValueFrom`.

### Por qué se usan signals

Los signals aparecen para estado local y derivado:

- Login: modelo de formulario.
- Detalle: modelo de edición.
- Listado: datos derivados de la respuesta.
- Paginacion: página actual, total y estados de borde.

Interpretacion: se usan para practicar y simplificar estado reactivo sin suscripciones manuales en componentes.

### Por qué existe `ExpedientesService`

El servicio separa el conocimiento HTTP de las páginas. `ExpedientesPage` no construye `HttpParams` ni conoce los detalles de `/api/expedientes`; solo llama a `getExpedientes`.

### Por qué existen modelos

Los modelos hacen explícitos los contratos:

- `Expediente` para el dominio.
- `FiltrosExpediente` para búsqueda.
- `ExpedientesListadoRespuesta` para la respuesta paginada.
- `ExpedienteForm` para el formulario de edición.

Interpretación: esta separación ayuda a aprender TypeScript aplicado a datos reales de una pantalla.

### Por qué `ExpedienteDetallePage` sirve para consulta y edición

Las rutas `/expedientes/:numero` y `/expedientes/:numero/editar` apuntan al mismo componente. La ruta de edición aporta `data: { modo: 'editar' }`, y el componente cambia de vista con:

```ts
esEdicion = computed(() => this.modo() === 'editar');
```

Interpretación: reutilizar el componente permite compartir busqueda del expediente, modelo de edición y navegación.

### Por qué la página de detalle usa el servicio

El detalle sigue el mismo flujo HTTP que el listado:

```ts
private recursoExpediente = rxResource({
  params: () => this.numero(),
  stream: ({ params: numero }) => {
    if (!numero) {
      return of(null);
    }

    return this.expedientesService.getExpediente(numero);
  },
});
```

Interpretación: así la página no conoce `EXPEDIENTES_MOCK`; solo conoce el contrato del servicio. El mock queda encapsulado detrás de `HttpClient` y `mockApiInterceptor`, igual que ocurriría con un backend real.

### Por qué la paginación esta separada

`ListadoPaginacion` recibe datos genéricos (`itemsPorPagina`, `totalItems`, `itemsPrevios`) y emite `cambioPagina`. No depende de expedientes.

Interpretación: esto permite reutilizar el componente con otros listados si aparecen más features.

## Inconsistencias detectadas entre README anterior y código

- El README anterior incluía un ejemplo de `imports: [ReactiveFormsModule]` para login, pero el código actual importa `FormField` de Signal Forms.
- El README anterior explicaba `getExpediente` en el servicio; el código actual ya lo usa desde la página de detalle mediante `rxResource()`.
- El README anterior describia una estructura mas plana para `core`; el codigo actual organiza cabecera, pie y 404 bajo `core/layout`, y la autenticacion bajo `features/auth`.
