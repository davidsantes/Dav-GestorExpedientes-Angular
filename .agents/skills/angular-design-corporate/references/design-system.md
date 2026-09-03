# Sistema de diseño corporativo

## Principios

- Mantener una estética profesional, sobria y consistente.
- Priorizar la jerarquía visual y la claridad de la información.
- Evitar decoración innecesaria, gradientes y sombras excesivas.
- Usar un color primario corporativo y colores semánticos para los estados.
- Aplicar una densidad adecuada para aplicaciones administrativas.

## Tokens

Centralizar los valores visuales mediante variables CSS:

- `--color-primary`
- `--color-surface`
- `--color-text`
- `--color-muted`
- `--color-success`
- `--color-warning`
- `--color-danger`
- `--spacing-*`
- `--radius-*`
- `--shadow-*`

No introducir colores, tamaños o espaciados arbitrarios cuando exista un token equivalente.

## Componentes

Los componentes corporativos deben ser pequeños, reutilizables y tipados. Como mínimo, contemplar:

- Botones y grupos de acciones.
- Campos de formulario.
- Tablas, filtros y paginación.
- Tarjetas de resumen.
- Badges y estados.
- Diálogos y confirmaciones.
- Notificaciones.
- Skeletons, estados vacíos y errores.

Cada componente debe documentar sus estados visuales y proporcionar una API clara.
