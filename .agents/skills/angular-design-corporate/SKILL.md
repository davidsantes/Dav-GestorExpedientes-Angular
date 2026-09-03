---
name: angular-design-corporate
description: Diseña interfaces corporativas profesionales, accesibles y consistentes para aplicaciones Angular con la estética propia de la identidad corporativa.
license: MIT
metadata:
  author: David Santesteban Herrero
  version: '1.0'
---

# Angular Corporate Design Skill

## Objetivo

Crear interfaces empresariales sobrias, claras, accesibles y consistentes para aplicaciones Angular.

## Directrices principales

- Priorizar usabilidad, jerarquía visual y productividad.
- Aplicar una estética corporativa limpia, profesional y sin decoración innecesaria.
- Diseñar responsive desde móvil hasta escritorio.
- Usar tokens de diseño centralizados en lugar de valores arbitrarios.
- Crear componentes pequeños, reutilizables, tipados y con una única responsabilidad.
- Contemplar siempre estados de carga, vacío, error, éxito y operación en curso.
- Cumplir WCAG 2.2 AA: HTML semántico, contraste, foco visible y navegación por teclado.

## Reglas Angular y TypeScript

- Usar componentes standalone sin declarar `standalone: true`.
- Usar signals, `computed()`, `input()`, `output()`, `model()` e `inject()`.
- Usar `@if`, `@for` y `@switch` en las plantillas.
- Usar lazy loading para las funcionalidades.
- Preferir Signal Forms o Reactive Forms.
- Evitar `any`, `ngClass`, `ngStyle`, `@HostBinding` y `@HostListener`.
- Usar `NgOptimizedImage` para imágenes estáticas.
- Mantener la lógica compleja fuera de las plantillas.

## Proceso de diseño

1. Identificar la jerarquía de información y la acción principal.
2. Seleccionar componentes y tokens existentes antes de crear estilos nuevos.
3. Diseñar los estados completos y los casos de error.
4. Verificar responsive, contraste, foco y navegación por teclado.
5. Consultar las referencias correspondientes para las decisiones detalladas.

## Checklist mínimo

- [ ] La jerarquía visual y la acción principal son claras.
- [ ] Todos los controles tienen nombre o etiqueta accesible.
- [ ] Se puede utilizar la interfaz completamente con teclado.
- [ ] Se contemplan carga, vacío y error.
- [ ] Funciona en móvil, tablet y escritorio.
- [ ] Usa tokens y componentes reutilizables.
- [ ] No contiene `any` ni lógica compleja en la plantilla.

## Referencias

- [Accesibilidad y WCAG](./references/accessibility.md)
- [Sistema de diseño corporativo](./references/design-system.md)
- [Patrones Angular](./references/angular-patterns.md)
- [Diseño responsive](./references/responsive-design.md)