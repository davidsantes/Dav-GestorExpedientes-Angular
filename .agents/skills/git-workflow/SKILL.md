---
name: git-workflow
description: Gestionar cambios Git en este repositorio: revisar diffs, preparar commits coherentes, usar Conventional Commits y evitar mezclar o revertir trabajo ajeno. Utilizar cuando se soliciten commits, ramas, historial, revisión de cambios, preparación de PR o limpieza del estado Git.
license: MIT
metadata:
  author: David Santesteban Herrero
  version: '1.0'
---

# Git Workflow

## Objetivo

Trabajar con Git de forma clara, segura y mantenible dentro de este repositorio Angular.

El código manda: antes de commitear o documentar un cambio, revisar el diff real y comprobar que los mensajes describen lo que se ha modificado.

## Principios

- No revertir cambios ajenos salvo petición explícita.
- Separar cambios independientes en commits distintos cuando tenga sentido.
- Mantener juntos código, tests y documentación si pertenecen al mismo cambio funcional.
- Revisar `git status` y `git diff` antes de proponer o crear un commit.
- Ejecutar siempre `npm test -- --watch=false` y `npm run build` antes de cerrar un cambio que afecte a código o configuración. Para cambios solo de documentación, omitirlas.
- Si tests o build fallan por los cambios realizados, no crear el commit; reportar el fallo y proponer una corrección antes de continuar.

## Conventional Commits

Usar Conventional Commits para los mensajes:

```text
tipo(scope): descripción breve
```

Tipos habituales:

- `feat`: nueva funcionalidad.
- `fix`: corrección de bug.
- `docs`: documentación.
- `test`: tests nuevos o corregidos.
- `refactor`: cambio interno sin alterar comportamiento.
- `style`: formato o estilos sin cambio funcional.
- `chore`: mantenimiento, dependencias o configuración.

Scopes recomendados para este proyecto:

- `auth`
- `expedientes`
- `routing`
- `material`
- `testing`
- `docs`
- `skills`

Ejemplos:

```text
docs(testing): documentar estrategia de pruebas con Vitest
test(expedientes): cubrir servicio e interceptor mock
fix(auth): proteger acceso a localStorage fuera del navegador
docs(skills): añadir flujo Git con conventional commits
```

## Preparar un commit

Antes de commitear:

1. Revisar `git status --short`.
2. Revisar el diff de los ficheros incluidos.
3. Confirmar que no se mezclan cambios no relacionados. Si al revisar `git status` aparecen cambios ajenos a la tarea actual, no incluirlos en el commit ni descartarlos; usar `git add` selectivo por rutas y avisar al usuario de los ficheros excluidos.
4. Ejecutar tests/build si el cambio afecta a código o configuración.
5. Elegir un mensaje Conventional Commit que explique el resultado, no solo la acción mecánica.

No incluir ficheros generados como `dist/` salvo que el proyecto lo pida explícitamente.

## Ramas

Cuando se necesite crear una rama, usar nombres descriptivos:

```text
feature/<tema>
fix/<tema>
docs/<tema>
test/<tema>
chore/<tema>
```

Ejemplos:

```text
docs/testing-guide
fix/auth-local-storage
test/http-interceptors
```

## Pull requests

Una descripción de PR debe incluir:

- qué cambia;
- por qué cambia;
- cómo se ha probado;
- riesgos o huecos pendientes.

Formato sugerido:

```markdown
## Cambios

- ...

## Verificación

- `npm test -- --watch=false`
- `npm run build`

## Notas

- ...
```

## Seguridad

Pedir confirmación antes de acciones destructivas o de amplio alcance, como:

- borrar ramas;
- reescribir historial;
- hacer force push;
- descartar cambios;
- resolver conflictos eliminando trabajo que no se haya creado en la tarea actual.

Preferir comandos no interactivos y revisar el estado después de operaciones Git importantes.
