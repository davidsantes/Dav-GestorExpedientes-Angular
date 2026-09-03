---

name: angular-testing
description: Analizar, diseñar, generar, ejecutar y documentar pruebas automatizadas en proyectos Angular. Utilizar cuando se solicite revisar la estrategia de testing, crear o mejorar tests, analizar cobertura, detectar huecos de pruebas, generar tests para una feature o corregir regresiones. Priorizar pruebas útiles basadas en comportamiento y riesgo, evitando tests mecánicos orientados únicamente a cobertura.
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Angular Testing

Analizar siempre el código antes de escribir tests.

No generar tests fichero a fichero de forma mecánica ni crear pruebas únicamente para aumentar cobertura.

## Flujo de trabajo

1. Analizar el ámbito solicitado.
2. Identificar funcionalidades, reglas de negocio y comportamientos observables.
3. Revisar los tests existentes.
4. Identificar riesgos de regresión.
5. Diseñar una matriz de pruebas antes de generar código.
6. Priorizar los casos según riesgo y valor funcional.
7. Crear o modificar los tests necesarios.
8. Ejecutar los tests afectados.
9. Ejecutar la suite completa cuando sea razonable.
10. Revisar errores, fragilidad y duplicidades.
11. Revisar cobertura como indicador, no como objetivo.
12. Actualizar la documentación de testing.
13. Entregar un resumen de lo protegido y de los huecos pendientes.

## Referencias

Consultar `references/testing-strategy.md` para decidir qué debe probarse y con qué prioridad.

Consultar `references/angular-testing.md` para seleccionar herramientas, APIs y patrones específicos de Angular.

Consultar `references/test-quality.md` para validar la calidad de los tests generados.

Consultar `references/documentation.md` para crear o actualizar la documentación de testing del proyecto.

## Reglas obligatorias

Antes de crear cualquier test, realizar un inventario interno de:

* comportamientos;
* riesgos;
* ramas;
* dependencias;
* errores;
* casos límite.

No generar automáticamente un `.spec.ts` por cada fichero existente.

No considerar `should create` como cobertura suficiente de un componente.

No modificar código productivo únicamente para satisfacer un test artificial.

Cuando se corrija un bug, intentar reproducir primero el defecto mediante un test de regresión.

Preferir comprobar comportamiento observable frente a detalles internos de implementación.

Mockear únicamente los límites necesarios.

Ejecutar los tests después de modificarlos y no finalizar una tarea de testing con tests conocidos en rojo.

Si el código es difícil de probar, señalar la causa y proponer el refactor mínimo necesario en lugar de ocultarlo mediante mocks complejos.
