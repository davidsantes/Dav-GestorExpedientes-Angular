# Copilot Instructions - Gestor de Expedientes

## Contexto del proyecto
- Proyecto Angular 22 con TypeScript.
- Se usan componentes standalone.
- La estructura principal sigue el patrón feature-first.
- El dominio de la aplicación es español: expediente, estado, prioridad, filtro, detalle.

## Arquitectura
- Mantener la organización por feature dentro de `src/app/features/`:
  - `components/`
  - `pages/`
  - `services/`
  - `models/`
  - `data/`
  - `*.routes.ts`
- Preferir lógica de negocio en servicios y no en los componentes.
- Reutilizar patrones ya existentes del proyecto.
- Mantener rutas con lazy loading cuando se añadan nuevas secciones de expedientes.

## Estilo de código
- Usar PascalCase para clases y componentes.
- Usar camelCase para propiedades, métodos y variables.
- Preferir `inject()` sobre inyección por constructor cuando el proyecto lo permita.
- Usar `@Component({ imports: [...], templateUrl, styleUrl })` en los componentes.
- Para datos reactivos, preferir `input()`, `computed()`, `resource()` si encaja con el patrón actual.
- Mantener `private readonly` para dependencias inyectadas y propiedades internas.
- Evitar código duplicado y crear utilidades solo si realmente se reutiliza.

## Angular Material y estilos
- Importar únicamente los módulos de Angular Material que utiliza cada componente standalone.
- Mantener el tema Material 3 definido en `src/material-theme.scss`, con paleta primaria roja y terciaria cian.
- Reutilizar los componentes ya adoptados: `MatCard`, `MatToolbar`, `MatFormField`, `MatInput`, `MatSelect`, `MatTable`, `MatSort`, `MatPaginator` y `MatIcon`.
- No aplicar selectores CSS genéricos como `button`, `input`, `select` o `label` sobre vistas que usen Angular Material; usar selectores específicos del componente Material o clases propias.
- Mantener los colores institucionales definidos como variables CSS en `src/styles.css` y respetar contraste y foco accesible.
- Usar `mat-sort-header` para columnas ordenables y conservar el array recibido sin mutarlo al ordenar datos localmente.

## Routing
- Mantener la estructura actual de rutas:
  - `/login`
  - `/expedientes`
  - `/expedientes/:numero`
- Cuando se añadan filtros, usarlos con query params y navegación mediante `router.navigate(...)`.
- No cambiar la navegación global sin justificarlo.

## Servicios y modelos
- Los servicios deben encapsular llamadas HTTP y transformación de datos.
- Los `interface` y `type` deben vivir en `models/` y reutilizarse en toda la feature.
- Evitar hardcodear valores del dominio en varios sitios; centralizarlos en modelos o enums.

## Testing
- Añadir tests para lógica de negocio, servicios y flujos de navegación importantes.
- Mantener tests simples y cercanos al comportamiento real.
- No probar mocks de forma aislada si se puede verificar comportamiento real.

## Documentación
- Mantener `README.md` y los documentos de `docs/` en español, incluidos los acentos.
- Basar ejemplos y descripciones en el código actual, sin documentar APIs, rutas, componentes o estructuras inexistentes.
- Al añadir o renumerar documentos, actualizar `docs/README.md` y comprobar sus enlaces relativos.
- Documentar los cambios relevantes de Angular Material, los datos de dominio compartidos y los flujos de interfaz cuando cambien.

## Generación de código
- Seguir el estilo actual del proyecto antes que inventar una nueva convención.
- Preferir cambios pequeños y consistentes con la estructura ya existente.
- Si existe un patrón en el proyecto, usar ese patrón en lugar de crear uno nuevo.
- Generar código claro, legible y listo para Angular 22.

## Validación
- Al terminar cambios, validar con comandos relevantes del proyecto como:
  - Para cambios de interfaz o configuración: `npm run build`.
  - Para cambios de lógica: `npm test` o pruebas específicas.
  - Antes de crear un commit: `git diff --check`.