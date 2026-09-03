# Testing

Este proyecto usa tests unitarios y de integración ligera para explicar cómo se valida una aplicación Angular 22 sin depender de un backend real.

El objetivo no es alcanzar cobertura por acumulación, sino proteger comportamientos que puedan romperse: autenticación, autorización, llamadas HTTP, interceptores, formularios, paginación y navegación.

## Herramientas

Los tests se ejecutan con el builder moderno de Angular:

```bash
ng test
```

En `package.json` el comando real es:

```bash
npm test
```

Para una ejecución puntual, sin modo watch:

```bash
npm test -- --watch=false
```

Angular ejecuta la suite sobre **Vitest**. `tsconfig.spec.json` incluye `vitest/globals`, por eso los specs pueden usar `describe`, `it`, `expect` y `beforeEach` sin importarlos en cada fichero.

El entorno de test usa **jsdom** para simular el DOM en Node. Esto permite crear componentes con `TestBed`, renderizar plantillas, consultar elementos HTML y disparar interacciones sin abrir un navegador real.

## Qué se prueba

La suite actual combina varios tipos de pruebas:

| Área | Ejemplo | Qué enseña |
| --- | --- | --- |
| Componentes | `ExpedientesListado`, `ListadoPaginacion` | Inputs, outputs, signals calculadas y comportamiento visible. |
| Formularios | `Login`, `ExpedientesListadoFiltro`, `ExpedienteDetallePage` | Signal Forms, `ngModel`, validación y conversión de fechas. |
| Servicios HTTP | `ExpedientesService` | Construcción de URL, query params, método HTTP y body. |
| Interceptores | `mockApiInterceptor`, `authMockInterceptor`, `authTokenInterceptor` | API mock, autenticación, autorización y delegación al siguiente handler. |
| Guards | `authGuard`, `rolGuard` | Acceso permitido o bloqueado según sesión y rol. |
| Páginas | `ExpedientesPage`, `ExpedienteDetallePage` | Coordinación entre ruta, servicio, resource, template y navegación. |

## Patrón de un test

Los tests deben poder leerse como una historia pequeña:

1. Preparar el estado.
2. Ejecutar una acción.
3. Comprobar el resultado observable.

Ejemplo de un servicio HTTP:

```ts
service.getExpedientes({ estado: 'tramite' }, 0, 5).subscribe();

const req = httpTesting.expectOne((request) => request.url === '/api/expedientes');

expect(req.request.method).toBe('GET');
expect(req.request.params.get('estado')).toBe('tramite');
expect(req.request.params.get('skip')).toBe('0');
expect(req.request.params.get('limit')).toBe('5');

req.flush({ data: [], total: 0, skip: 0, limit: 5 });
```

Este test no comprueba que Angular funcione. Comprueba que `ExpedientesService` traduce los filtros de la aplicación a la petición HTTP que espera la API.

## TestBed

`TestBed` crea un entorno Angular para el test. Se usa cuando el código depende de inyección de dependencias, plantillas, providers, router o `HttpClient`.

Ejemplo:

```ts
await TestBed.configureTestingModule({
  imports: [ExpedientesPage],
  providers: [
    provideHttpClient(withInterceptors([mockApiInterceptor])),
    provideRouter([{ path: 'expedientes', component: ExpedientesPage }]),
  ],
}).compileComponents();
```

En componentes standalone, el componente se añade en `imports`, no en `declarations`.

## HTTP en tests

Hay dos enfoques en el proyecto:

- `HttpTestingController` para probar servicios y comprobar la petición emitida.
- `provideHttpClient(withInterceptors([...]))` para probar integraciones ligeras contra la API mock.

`HttpTestingController` es útil cuando interesa validar URL, método, parámetros y body sin ejecutar interceptores reales:

```ts
const req = httpTesting.expectOne('/api/expedientes/EXP-2026-0001');
expect(req.request.method).toBe('PUT');
expect(req.request.body).toEqual(expediente);
req.flush(expediente);
```

El interceptor mock se prueba aparte para confirmar que filtra, pagina, devuelve detalle, actualiza y delega las URLs que no son suyas.

## jsdom y DOM

jsdom permite comprobar renderizado básico:

```ts
fixture.detectChanges();

expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(5);
```

Este tipo de test es útil cuando el comportamiento depende de la plantilla. No debe usarse para inspeccionar detalles internos frágiles de Angular Material. Cuando un componente Material sea complejo, conviene preferir harnesses oficiales o comprobar el efecto visible de la interacción.

## Signals y resources

Los signals se prueban a través de resultados:

```ts
fixture.componentRef.setInput('itemsPrevios', 5);

expect(component.paginaActual()).toBe(2);
expect(component.ultimaPagina()).toBe(true);
```

Cuando el componente usa `rxResource()`, el test debe esperar a que Angular estabilice la carga:

```ts
fixture.componentRef.setInput('numero', 'EXP-2026-0001');
fixture.detectChanges();
await fixture.whenStable();

expect(component.expediente().titulo).toBe('Solicitud de licencia de actividad 1');
```

## Guards y autorización

Los guards se prueban sustituyendo solo el límite que necesitan: `AuthService`.

```ts
TestBed.configureTestingModule({
  providers: [
    { provide: AuthService, useValue: { estaAutenticado: () => true } },
  ],
});

expect(executeGuard({} as never, {} as never)).toBe(true);
```

Así el test explica la regla: si hay sesión, `authGuard` permite entrar; si no hay sesión, bloquea la ruta.

## Flujo con IA

Cuando el agente de IA trabaja sobre el proyecto, el flujo esperado es:

1. Leer el código y los tests existentes.
2. Identificar comportamiento, riesgos y casos límite.
3. Escribir o modificar el código.
4. Crear tests que protejan el cambio.
5. Ejecutar `npm test -- --watch=false`.
6. Corregir fallos reales.
7. Ejecutar `npm run build`.
8. Documentar lo cambiado si afecta a arquitectura, testing o uso del proyecto.

La IA puede acelerar el ciclo, pero los tests deben seguir siendo comprensibles para una persona. Un buen test debe enseñar qué regla protege y fallar si esa regla se rompe.

## Convenciones

- Los specs viven junto al fichero que prueban, con sufijo `.spec.ts`.
- Mantener `should create` solo como smoke test, no como cobertura suficiente.
- Preferir nombres en lenguaje de negocio: `bloquea la ruta cuando no hay sesion autenticada`.
- Evitar sleeps y esperas arbitrarias.
- Mockear solo límites externos o dependencias que no forman parte del comportamiento probado.
- No probar métodos privados directamente.
- Usar fixtures pequeños y legibles.
- Después de tocar tests, ejecutar la suite completa cuando sea razonable.

## Estado actual

La suite actual cubre los flujos principales de una forma adecuada para una aplicación didáctica:

- autenticación y rol;
- listado, filtros y paginación;
- detalle cargado por servicio HTTP;
- edición y guardado;
- API mock;
- integración básica con router y DOM.

Huecos razonables para futuras mejoras:

- tests de error visual para respuestas `403` y `404` cuando se implemente feedback específico;
- tests con harnesses de Angular Material en interacciones más complejas;
- algún E2E de login, listado, detalle, edición y logout si el proyecto pasa de demo didáctica a aplicación más cercana a producción.

## Referencias

- [Angular testing](https://angular.dev/guide/testing)
- [Angular testing services](https://angular.dev/guide/testing/services)
- [Angular testing components scenarios](https://angular.dev/guide/testing/components-scenarios)
- [Vitest](https://vitest.dev/)
- [jsdom](https://github.com/jsdom/jsdom)
- [Angular CDK Component Harnesses](https://material.angular.dev/cdk/test-harnesses/overview)
