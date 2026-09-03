# Accesibilidad y WCAG

## Objetivo

Todas las interfaces deben cumplir, como mínimo, WCAG 2.2 nivel AA y superar las comprobaciones automatizadas de axe cuando sea posible.

## Reglas

- Usar HTML semántico antes que elementos genéricos con roles ARIA.
- Asociar cada campo con una etiqueta visible mediante `label` y `for`.
- Proporcionar nombres accesibles a botones, enlaces e iconos.
- No comunicar información únicamente mediante color.
- Mantener contraste suficiente entre texto, controles y fondos.
- Mostrar un indicador de foco visible y consistente.
- Garantizar navegación completa mediante teclado.
- Mantener un orden lógico de tabulación.
- Gestionar el foco al abrir y cerrar diálogos y al cambiar de vista.
- Usar `aria-live` para mensajes dinámicos relevantes.
- Permitir cerrar diálogos con `Escape`.
- Proporcionar mensajes de error claros y asociados al control correspondiente.
- Respetar `prefers-reduced-motion` y evitar animaciones imprescindibles.

## Revisión

- Probar con teclado sin utilizar el ratón.
- Verificar zoom al 200% y diseño responsive.
- Comprobar estados `focus`, `hover`, `disabled`, `loading` y `error`.
- Ejecutar axe y revisar manualmente los resultados.
