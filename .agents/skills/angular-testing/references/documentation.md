# Documentación de testing

## Objetivo

Mantener una documentación de testing útil para desarrollo, mantenimiento y revisión.

No duplicar literalmente el contenido de los ficheros `.spec.ts`.

Documentar comportamientos protegidos y estrategia.

## Estructura recomendada

Crear cuando no exista:

docs/
└── testing/
├── README.md
├── test-matrix.md
└── test-cases.md

Adaptar la ubicación si el proyecto ya utiliza otra estructura documental coherente.

## README.md

Debe explicar:

### Objetivo

Qué pretende proteger la estrategia de testing del proyecto.

### Tecnologías

Indicar:

* runner;
* herramientas Angular;
* herramientas de cobertura;
* E2E si existe.

No documentar herramientas que no estén realmente utilizadas.

### Tipos de test

Describir brevemente los existentes:

* unitarios;
* servicios;
* HTTP;
* guards;
* routing;
* componentes;
* formularios;
* integración;
* E2E.

### Ejecución

Documentar comandos reales del proyecto para:

* ejecutar tests;
* ejecutar un test;
* modo watch;
* cobertura;
* E2E cuando exista.

No inventar comandos. Obtenerlos de `package.json` o configuración equivalente.

### Convenciones

Documentar:

* naming;
* ubicación de specs;
* mocking;
* Given/When/Then;
* regresiones;
* política de cobertura.

## test-matrix.md

Mantener una matriz como:

| Área | Componente | Tipo de test | Comportamiento protegido | Casos principales | Estado |
| ---- | ---------- | ------------ | ------------------------ | ----------------- | ------ |

Ejemplo:

| Auth | authGuard | Guard/Router | Impide acceso anónimo | autenticado / no autenticado | Cubierto |
| Expedientes | ExpedienteService | HTTP | Consulta por número | 200 / 404 / 500 | Cubierto |
| Expedientes | Detalle | Component | Muestra expediente | correcto / error | Cubierto |

Estados recomendados:

* Cubierto
* Parcial
* Pendiente
* No aplica

No marcar como Cubierto si solo existe un `should create`.

## test-cases.md

Documentar únicamente escenarios funcionales relevantes.

Formato recomendado:

### AUTH-001 — Acceso anónimo a expedientes

**Precondición**

Usuario no autenticado.

**Acción**

Acceder a `/expedientes`.

**Resultado esperado**

El usuario es redirigido a `/login`.

---

### EXP-DET-001 — Consulta de expediente existente

**Precondición**

Existe el expediente solicitado.

**Acción**

Abrir la pantalla de detalle.

**Resultado esperado**

Se muestran correctamente los datos del expediente.

## Identificadores

Utilizar identificadores legibles por área.

Ejemplos:

* AUTH-001
* EXP-LIST-001
* EXP-DET-001
* EXP-EDIT-001

No es necesario documentar cada `it()`.

Agrupar varios tests técnicos bajo un mismo caso funcional cuando protejan el mismo comportamiento.

## Actualización

Actualizar la documentación cuando:

* se añada una funcionalidad relevante;
* se añadan nuevos tipos de test;
* cambie la estrategia;
* se detecte un nuevo riesgo;
* se corrija una regresión importante;
* se añada o elimine E2E.

No modificar documentación por cambios triviales que no afecten al comportamiento.

## Resumen de una tarea de testing

Al finalizar una tarea, informar:

* ámbito analizado;
* tests creados o modificados;
* comportamientos protegidos;
* casos positivos;
* casos negativos;
* errores cubiertos;
* tests ejecutados;
* resultado;
* cobertura disponible;
* huecos relevantes pendientes.

Distinguir claramente entre:

* probado;
* parcialmente probado;
* no probado.

No afirmar cobertura funcional basándose únicamente en cobertura de líneas.
