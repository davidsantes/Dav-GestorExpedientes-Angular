# Testing específico de Angular

## Principio general

Utilizar las herramientas ya configuradas en el proyecto.

No introducir un nuevo framework de testing salvo que exista una necesidad clara.

Consultar la documentación oficial de Angular como referencia prioritaria cuando existan dudas sobre APIs o patrones.

## Runner

Si el proyecto utiliza Vitest, mantener Vitest.

Si el proyecto ya utiliza otra solución válida, no migrarla únicamente para crear tests.

No introducir Jasmine o Karma en un proyecto moderno que no los utilice.

## Componentes

Utilizar cuando corresponda:

* TestBed;
* ComponentFixture;
* providers;
* mocks de servicios;
* DOM real del componente.

Probar el template cuando el comportamiento dependa de:

* renderizado;
* eventos;
* directivas;
* inputs;
* outputs;
* elementos condicionales;
* interacción.

## Servicios

Para servicios sin dependencias complejas, valorar instanciación directa.

Utilizar TestBed cuando:

* exista inyección de dependencias;
* se necesite sustituir providers;
* el comportamiento dependa del entorno Angular.

## HTTP

Utilizar:

* provideHttpClient;
* provideHttpClientTesting;
* HttpTestingController.

No realizar peticiones reales.

Verificar:

* URL;
* método;
* body;
* parámetros;
* headers;
* respuesta;
* error.

Ejecutar `verify()` cuando sea apropiado para detectar requests no consumidas.

## Router

Utilizar:

* provideRouter;
* RouterTestingHarness cuando ayude a probar navegación real.

Preferir comprobar:

* URL final;
* componente cargado;
* redirección;
* guard;
* parámetros;
* route data.

Evitar limitar el test de routing a comprobar funciones internas cuando el comportamiento observable es una navegación.

## Guards

Probar guards funcionales mediante navegación cuando sea viable.

Casos mínimos habituales:

* permitido;
* denegado;
* redirigido.

Para guards de rol:

* rol permitido;
* rol no permitido;
* usuario sin rol;
* usuario no autenticado.

## Signals

Probar comportamiento observable derivado de signals.

Evitar probar detalles internos de implementación del signal.

Comprobar:

* estado inicial;
* actualización;
* valores derivados;
* reacción del template.

## Inputs y outputs

Comprobar:

* entrada válida;
* cambios de input;
* salida emitida;
* payload del evento;
* ausencia de emisiones incorrectas.

## Formularios reactivos

Probar:

* valores iniciales;
* validadores;
* estado valid/invalid;
* touched/dirty únicamente cuando afecte a comportamiento;
* payload;
* submit;
* edición;
* reset.

No probar internamente la implementación de Angular Forms.

## Async

Evitar:

* sleeps;
* timeouts arbitrarios;
* esperas manuales.

Utilizar las utilidades del framework cuando sean necesarias.

Los tests deben ser deterministas.

## Standalone components

Configurar los tests respetando la naturaleza standalone del componente.

No añadir módulos artificiales únicamente por costumbre de versiones antiguas de Angular.

## Material

Si el proyecto utiliza Angular Material:

* probar comportamiento, no implementación interna de Material;
* utilizar harnesses oficiales cuando aporten claridad;
* evitar seleccionar DOM interno frágil de componentes Material.

## Mock API

Si existe un interceptor de API mock:

Probar por separado:

* matching de URLs;
* métodos;
* responses;
* errores;
* passthrough.

Evitar que todos los tests dependan del interceptor mock si un mock de servicio más simple resulta suficiente.
