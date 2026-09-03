# Calidad de los tests

## Principio

Cada test debe justificar su existencia.

Un test debe proteger al menos uno de estos elementos:

* regla;
* comportamiento;
* integración;
* error;
* caso límite;
* regresión.

## Nombres

Utilizar nombres que describan comportamiento.

Preferir:

`should redirect to login when user is not authenticated`

`should display an error when expediente does not exist`

`should prevent edition when user lacks the required role`

Evitar:

`should work`

`should be valid`

`test service`

`test component`

## Estructura

Seguir conceptualmente:

Given / When / Then

o:

Arrange / Act / Assert

Mantener claramente separadas preparación, acción y comprobación.

## Assertions

Comprobar resultados relevantes.

Evitar assertions triviales que no detecten regresiones.

Ejemplo de bajo valor:

`expect(service).toBeTruthy()`

cuando el servicio no tiene ninguna configuración relevante.

## `should create`

Puede mantenerse como smoke test cuando tenga sentido.

Nunca considerarlo prueba suficiente de un componente.

## Independencia

Cada test debe poder ejecutarse aisladamente.

No depender de:

* orden;
* estado de otros tests;
* datos creados por tests anteriores;
* reloj real;
* servicios externos.

## Determinismo

No utilizar:

* sleeps;
* delays arbitrarios;
* fechas variables sin controlar;
* valores aleatorios sin semilla o control;
* red real.

## Mocking

Mockear solo lo necesario.

Preferir:

* límites externos;
* APIs;
* almacenamiento;
* reloj;
* navegación cuando no se pruebe routing.

Evitar mockear:

* cada método interno;
* cada dependencia sin necesidad;
* la propia lógica que se pretende comprobar.

## Encapsulación

No probar métodos privados directamente salvo casos excepcionales.

Probarlos a través del comportamiento público observable.

Si una lógica privada requiere demasiados tests directos, considerar extraerla a una unidad con responsabilidad propia.

## Tipado

No utilizar `any` para simplificar mocks cuando exista un tipo adecuado.

Crear factories o builders de test cuando los objetos sean grandes o repetitivos.

## Fixtures

Mantener fixtures:

* mínimos;
* legibles;
* relevantes para el escenario.

Evitar objetos enormes con datos irrelevantes.

## Duplicidad

No crear varios tests que protejan exactamente el mismo comportamiento sin aportar nuevos escenarios.

## Fragilidad

Evitar assertions sobre:

* orden de llamadas sin importancia funcional;
* estructura DOM interna irrelevante;
* textos no funcionales;
* detalles privados;
* implementación del framework.

## Cobertura

No perseguir 100 % de cobertura por defecto.

Priorizar:

* lógica;
* errores;
* decisiones;
* ramas;
* permisos;
* comportamiento observable.

Una línea trivial sin cubrir puede ser aceptable.

## Código difícil de probar

Si para probar una unidad hacen falta:

* muchos mocks;
* configuración excesiva;
* conocimiento de detalles internos;
* estados artificiales;

analizar si existe un problema de diseño.

Proponer el refactor mínimo necesario.

No realizar grandes refactors sin necesidad.

## Revisión final

Antes de finalizar, comprobar:

* ¿fallaría el test si el comportamiento protegido se rompe?
* ¿el nombre explica qué protege?
* ¿es determinista?
* ¿es independiente?
* ¿mockea solo lo necesario?
* ¿aporta información distinta a otros tests?
* ¿protege comportamiento y no implementación?

Eliminar o rehacer tests que no superen estas preguntas.
