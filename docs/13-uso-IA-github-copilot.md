# Uso de IA en el desarrollo

Este proyecto utiliza la inteligencia artificial como **asistente de desarrollo**. La IA ayuda a analizar código, proponer cambios, generar componentes y tests, explicar decisiones técnicas y revisar problemas, pero las decisiones finales y la validación del resultado corresponden al equipo.

La configuración se organiza en tres capas:

1. **Instrucciones**: reglas y contexto permanente del proyecto.
2. **Skills**: conocimiento especializado que se aplica según la tarea.
3. **MCP**: herramientas que el agente puede ejecutar para trabajar con Angular.

## 1. Instrucciones del proyecto

El fichero [`.github/copilot-instructions.md`](../.github/copilot-instructions.md) contiene las reglas que deben tenerse en cuenta al generar o modificar código con GitHub Copilot.

Estas instrucciones se envían como contexto permanente e indican, entre otras cosas:

- Usar Angular 22 y componentes standalone.
- No declarar explícitamente `standalone: true`.
- Usar signals, `computed()`, `input()`, `output()`, `model()` e `inject()`.
- Preferir Signal Forms para formularios nuevos y Reactive Forms cuando corresponda.
- Usar `@if`, `@for` y `@switch`.
- Evitar `any`, `ngClass`, `ngStyle`, `@HostBinding` y `@HostListener`.
- Usar `NgOptimizedImage` para imágenes estáticas.
- Mantener los componentes pequeños, tipados, accesibles y con una única responsabilidad.
- Cumplir WCAG 2.2 AA y superar las comprobaciones de axe cuando sea posible.

El fichero debe contener convenciones estables y aplicables a todo el repositorio. Las instrucciones específicas de una tarea deben indicarse en la conversación o en el skill correspondiente.

### Configuración según el agente

Cada herramienta de IA puede buscar las instrucciones en ubicaciones diferentes. En este repositorio ya está configurado GitHub Copilot mediante `.github/copilot-instructions.md`.

Al trabajar con otros agentes, se debe utilizar el fichero de instrucciones que admita cada uno, por ejemplo:

| Agente | Configuración habitual |
| --- | --- |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` |
| Agentes compatibles con AGENTS.md | `AGENTS.md` |
| Cursor | `.cursor/rules/` o su configuración equivalente |
| Gemini CLI | `GEMINI.md` o la configuración indicada por la herramienta |

No es necesario duplicar instrucciones si el agente puede leer directamente el fichero existente. Si una herramienta no reconoce `.github/copilot-instructions.md`, se debe crear su fichero equivalente y mantener ambos sincronizados.

La documentación oficial de Angular incluye ejemplos y recomendaciones para estas instrucciones:

- [Develop with AI](https://angular.dev/ai/develop-with-ai)
- [Angular best practices](https://angular.dev/assets/context/best-practices.md)

## 2. Skills

Un **skill** es un conjunto de instrucciones reutilizables y conocimiento especializado que el agente consulta dinámicamente según la tarea. A diferencia de las instrucciones generales, un skill puede centrarse en una actividad concreta: crear una aplicación, implementar componentes, escribir tests o aplicar el diseño corporativo.

Los skills disponibles actualmente en este repositorio son:

| Skill | Uso |
| --- | --- |
| `angular-developer` | Desarrollo general de Angular, reactividad, formularios, routing, HTTP, testing y CLI. |
| `angular-new-app` | Creación de nuevas aplicaciones Angular mediante Angular CLI. |
| `angular-design-corporate` | Diseño corporativo, Angular Material, accesibilidad, tokens visuales y responsive. |

Se encuentran en:

````text
.agents/skills/
├── angular-developer/
├── angular-new-app/
└── angular-design-corporate/
	├── SKILL.md
	└── references/
		├── accessibility.md
		├── angular-patterns.md
		├── design-system.md
		└── responsive-design.md
````

Cada skill tiene un `SKILL.md` con las instrucciones principales. La carpeta `references/` contiene documentación detallada que el agente puede consultar cuando necesita profundizar en un tema.

El skill corporativo se ha adaptado a la identidad visual del proyecto. Tiene en cuenta Angular Material 22, componentes accesibles, tablas, formularios, estados de interfaz y diseño responsive. Su objetivo no es sustituir a Angular Material, sino indicar cómo utilizar sus componentes dentro de una interfaz corporativa coherente.

### Instalar skills oficiales de Angular

Angular mantiene skills oficiales que se pueden añadir a un entorno de agentes con:

````powershell
npx.cmd skills add https://github.com/angular/skills
````

Durante la instalación se seleccionan los agentes compatibles a los que se desea incorporar los skills. Entre los skills oficiales se encuentran, por ejemplo, `angular-developer` y `angular-new-app`.

La instalación debe revisarse antes de sobrescribir los skills personalizados del repositorio. El skill corporativo debe permanecer dentro de `.agents/skills/` para que forme parte del proyecto y pueda versionarse junto con el código.

Más información:

- [Angular agent skills](https://angular.dev/ai/agent-skills)
- [Agent Skills](https://agentskills.io/home)

## 3. MCP: Model Context Protocol

**MCP (Model Context Protocol)** es un protocolo que permite conectar un agente de IA con herramientas y fuentes de información externas. En este proyecto se utiliza para proporcionar al agente herramientas del Angular CLI.

El servidor MCP de Angular CLI es local y se configura en [`.vscode/mcp.json`](../.vscode/mcp.json):

````json
{
	"servers": {
		"angular-cli": {
			"command": "npx",
			"args": ["-y", "@angular/cli@22", "mcp"]
		}
	}
}
````

Esta configuración permite que el entorno de desarrollo inicie el servidor con Angular CLI 22 y que el agente pueda utilizar sus herramientas, por ejemplo para consultar buenas prácticas o realizar operaciones relacionadas con el CLI. MCP no contiene reglas de estilo: las reglas están en las instrucciones y los skills.

El servidor puede utilizarse mediante el Angular CLI con:

````powershell
npx.cmd ng mcp
````

En Windows, si PowerShell bloquea `npm.ps1` por la política de ejecución, se puede utilizar `npm.cmd` o ejecutar los comandos desde `cmd`.

Más información:

- [Angular CLI MCP Server](https://angular.dev/ai/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Instalación de GitHub Copilot CLI

La extensión de GitHub Copilot para VS Code y GitHub Copilot CLI son herramientas distintas. Para instalar Copilot CLI globalmente se puede utilizar:

````powershell
npm.cmd install -g @github/copilot
````

La instalación del CLI no es necesaria para que VS Code utilice `.github/copilot-instructions.md`, pero permite trabajar con Copilot desde el terminal.

## Flujo recomendado

Al solicitar ayuda a la IA:

1. Indicar claramente el objetivo y el contexto de la funcionalidad.
2. Permitir que el agente lea las instrucciones del repositorio.
3. Aplicar el skill relacionado con la tarea.
4. Usar MCP cuando sea necesario consultar o ejecutar herramientas de Angular CLI.
5. Revisar el código generado, especialmente seguridad, accesibilidad y lógica de negocio.
6. Ejecutar las comprobaciones del proyecto antes de aceptar los cambios:

````powershell
npm.cmd run build
npm.cmd test -- --watch=false
````

La IA acelera el desarrollo, pero no sustituye la revisión humana ni las pruebas automatizadas.
