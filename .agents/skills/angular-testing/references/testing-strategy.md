# Estrategia de testing

## Objetivo

Diseñar pruebas que detecten regresiones reales y validen comportamiento funcional.

La cobertura de código es un indicador secundario.

No escribir tests únicamente para incrementar porcentajes de cobertura.

## Prioridad de pruebas

Priorizar en este orden:

1. Reglas de negocio.
2. Autenticación y autorización.
3. Guards.
4. Servicios.
5. Integraciones HTTP.
6. Formularios.
7. Routing.
8. Componentes con lógica.
9. Casos de error.
10. Casos límite.
11. Integraciones entre piezas Angular.
12. E2E para flujos críticos.

No aplicar esta lista de forma automática. Ajustar la prioridad al riesgo real del proyecto.

## Análisis previo

Antes de generar tests, identificar:

* responsabilidad del código;
* entradas;
* salidas;
* dependencias;
* reglas;
* estados;
* ramas;
* errores posibles;
* navegación;
* permisos;
* efectos secundarios.

Crear mentalmente o de forma explícita una matriz:

| Área | Comportamiento | Riesgo | Tipo de test | Prioridad |
| ---- | -------------- | ------ | ------------ | --------- |

## Servicios

Comprobar:

* resultados correctos;
* transformaciones;
* reglas de negocio;
* cálculos;
* filtros;
* estados derivados;
* ausencia de datos;
* casos límite;
* errores.

No probar métodos triviales sin comportamiento.

## HTTP

Comprobar cuando corresponda:

* URL;
* método;
* parámetros;
* query string;
* body;
* headers;
* respuesta;
* errores HTTP;
* errores de red;
* ausencia de requests inesperadas.

Casos habituales:

* 200;
* 400;
* 401;
* 403;
* 404;
* 409;
* 500.

No crear todos los casos por defecto si no tienen sentido funcional.

## Interceptores

Comprobar:

* peticiones interceptadas;
* peticiones no interceptadas;
* modificación de requests;
* modificación de responses;
* headers;
* autenticación;
* mocks;
* errores;
* coincidencias parciales o URLs inesperadas.

## Guards

Comprobar:

* acceso permitido;
* acceso denegado;
* usuario autenticado;
* usuario no autenticado;
* rol permitido;
* rol no permitido;
* ausencia de rol;
* redirección esperada.

Preferir probar el resultado de navegación cuando sea relevante.

## Routing

Comprobar:

* rutas principales;
* parámetros;
* rutas hijas;
* redirecciones;
* lazy loading;
* guards;
* route data;
* rutas desconocidas;
* página 404.

## Componentes

Distinguir entre:

### Lógica

Comprobar:

* estado inicial;
* carga;
* eventos;
* llamadas a servicios;
* estados derivados;
* errores.

### Template

Comprobar:

* texto visible;
* datos renderizados;
* botones;
* elementos condicionales;
* interacción;
* mensajes de error;
* navegación;
* estados loading;
* estados empty;
* estados error.

No limitar los tests a invocar métodos de la clase.

## Formularios

Comprobar:

* estado inicial;
* campos obligatorios;
* validadores;
* valores límite;
* formulario válido;
* formulario inválido;
* habilitación de acciones;
* payload;
* envío;
* error del backend;
* modo alta;
* modo edición.

## Autorización

Probar tanto la protección funcional como la interfaz.

Comprobar:

* acceso a rutas;
* acceso a acciones;
* botones visibles;
* botones ocultos;
* menús;
* acciones de edición;
* acciones administrativas.

Evitar situaciones donde una acción se muestre aunque el usuario no pueda ejecutarla.

## Casos límite

Valorar explícitamente:

* null;
* undefined;
* lista vacía;
* ID inexistente;
* datos incompletos;
* formato incorrecto;
* valores mínimos;
* valores máximos;
* duplicados;
* datos inesperados;
* navegación directa por URL;
* estado previo inexistente.

## Tests de integración Angular

Crear cuando aporten valor.

Ejemplos:

* Router + Guard + Component.
* Component + Service mock.
* Form + Service + navegación.
* Guard + estado de autenticación.

Evitar mocks excesivos que conviertan el test en una réplica de la implementación.

## E2E

Reservar para flujos críticos.

Ejemplos:

* login;
* consulta;
* alta;
* edición;
* eliminación;
* permisos;
* logout;
* navegación principal.

No utilizar E2E para cubrir lógica que pueda probarse de forma más rápida y estable en tests inferiores.

## Regresiones

Cuando exista un bug:

1. Reproducirlo mediante un test cuando sea posible.
2. Confirmar que el test falla.
3. Corregir el código.
4. Confirmar que el test pasa.
5. Mantener el test como protección permanente.
