# Patrones Angular

## Componentes

- Usar componentes standalone y no declarar explícitamente `standalone: true`.
- No establecer explícitamente `ChangeDetectionStrategy.OnPush`.
- Usar `input()`, `output()` y `model()` según corresponda.
- Usar `inject()` en lugar de inyección por constructor.
- Mantener los componentes pequeños y con una única responsabilidad.
- Preferir plantillas inline para componentes pequeños.
- Usar rutas lazy para funcionalidades.

## Estado y plantillas

- Usar signals para el estado local.
- Usar `computed()` para valores derivados.
- Usar `linkedSignal()` cuando el estado dependa de varias fuentes reactivas sincronizadas.
- Actualizar signals con `set()` o `update()`, nunca con `mutate()`.
- Usar `@if`, `@for` y `@switch`.
- Mantener la lógica compleja fuera de las plantillas.
- Evitar `ngClass` y `ngStyle`; usar bindings de clases y estilos.
- No usar `any`; preferir tipos explícitos o `unknown`.

## Formularios e imágenes

- Preferir Signal Forms para formularios nuevos.
- Si no se usan Signal Forms, preferir Reactive Forms.
- Usar `NgOptimizedImage` para imágenes estáticas.
- No usar `NgOptimizedImage` con imágenes inline en base64.
