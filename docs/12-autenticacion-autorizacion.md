# 12. Autenticación y autorización

La aplicación separa dos responsabilidades relacionadas, pero diferentes:

- **Autenticación**: identifica al usuario. Responde a la pregunta «¿quién es?». En este proyecto se inicia sesión con usuario y contraseña y se recibe un token.
- **Autorización**: decide qué puede hacer el usuario autenticado. Responde a «¿tiene permiso para esta acción?». Se basa en el rol recibido junto con el token.

## Roles y permisos

El modelo de autenticación define dos roles en `src/app/features/auth/models/auth.interface.ts`:

```ts
export type Rol = 'LECTOR' | 'EDITOR';
```

Los permisos funcionales de la aplicación son:

| Acción | LECTOR | EDITOR |
| --- | :---: | :---: |
| Ver el listado de expedientes | Sí | Sí |
| Buscar y filtrar expedientes | Sí | Sí |
| Consultar el detalle de un expediente | No | Sí |
| Editar un expediente | No | Sí |

El interceptor mock proporciona dos cuentas de prueba:

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `user` | `user` | `LECTOR` |
| `admin` | `admin` | `EDITOR` |

Estas credenciales también se muestran de manera informativa en la pantalla de inicio de sesión. Solo existen para el entorno mock; no son un mecanismo de seguridad para producción.

## AuthService

`AuthService`, en `src/app/core/services/auth-service.ts`, centraliza la sesión y la información de autorización de la aplicación.

Sus responsabilidades son:

1. Enviar las credenciales al endpoint `POST /api/auth/login`.
2. Validar que la respuesta contiene un token con estructura válida.
3. Conservar la sesión en una signal y en el navegador.
4. Exponer signals derivadas para saber si hay sesión, quién es el usuario y si es editor.
5. Eliminar la sesión al cerrar sesión.

La respuesta de login tiene esta forma:

```ts
interface LoginResponse {
	token: string;
	user: string;
	rol: 'LECTOR' | 'EDITOR';
}
```

El servicio expone los siguientes miembros:

```ts
estaAutenticado = computed(() => this.session() !== null);
nombreUsuarioAutenticado = computed(() => this.session()?.user ?? null);
esUsuarioEditor = computed(() => this.session()?.rol === 'EDITOR');

login(credenciales: LoginRequest): Observable<LoginResponse>;
logout(): void;
```

Por ejemplo, un componente puede leer la signal de rol sin suscripciones manuales:

```ts
readonly esEditor = this.authService.esUsuarioEditor;

// En el template:
@if (esEditor()) {
	<a routerLink="/expedientes/EXP-001">Consultar expediente</a>
}
```

## Persistencia de la sesión

La sesión se guarda bajo la clave `tienda-online.sesion` con `localStorage`:

```ts
localStorage.setItem(SESSION_KEY, JSON.stringify(response));
```

`localStorage` solo almacena cadenas, por lo que el objeto se transforma con `JSON.stringify()` al guardar y `JSON.parse()` al recuperar. Persiste aunque se cierre el navegador. Se puede inspeccionar desde las herramientas de desarrollo del navegador, en **Application/Almacenamiento > Local Storage**. Allí se verá el usuario, el rol y el token de la sesión mock.

`sessionStorage` es una alternativa con una duración más corta: sus datos se eliminan al cerrar la pestaña o la sesión del navegador. El proyecto utiliza `localStorage` para mantener la sesión entre aperturas del navegador.

En una aplicación real no debe confiarse en que ocultar elementos o modificar `localStorage` proteja los datos: el servidor debe validar siempre el token y los permisos.

## Inicio de sesión con Signal Forms

El componente `Login` usa Signal Forms. El formulario enlaza el modelo mediante `[formRoot]`, los controles mediante `[formField]` y configura la operación asíncrona con `submission`.

```ts
readonly loginModel = signal({ user: '', pass: '' });

readonly loginForm = form(this.loginModel, (schemaPath) => {
	required(schemaPath.user, { message: 'El usuario es obligatorio' });
	required(schemaPath.pass, { message: 'La contraseña es obligatoria' });
}, {
	submission: {
		action: async (model) => {
			await firstValueFrom(this.authService.login(model().value()));
		},
	},
});
```

La acción de envío del proyecto captura los errores de credenciales y los asocia al campo `pass`. Durante el envío, el botón se deshabilita y muestra `Accediendo...` mediante `loginForm().submitting()`.

Cuando un interceptor expulsa al usuario por una respuesta `401`, añade `returnUrl` a la navegación de login. Tras autenticarse, `Login` lee ese parámetro y vuelve a la ruta original:

```ts
const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
const destino = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
	? returnUrl
	: '/expedientes';

await this.router.navigateByUrl(destino);
```

La validación de que la URL comienza por `/` evita utilizar una dirección externa como destino. La guía oficial de Angular explica el mecanismo de `submission` en <https://angular.dev/guide/forms/signals/form-submission>.

## Guards de rutas

Los guards deciden si Angular activa una ruta. Se configuran con `canActivate` y devuelven un booleano, una `UrlTree` o un resultado asíncrono equivalente.

### authGuard

`authGuard` verifica que haya una sesión activa:

```ts
export const authGuard: CanActivateFn = () => {
	return inject(AuthService).estaAutenticado();
};
```

En `app.routes.ts` protege la feature completa de expedientes, que se carga de forma diferida:

```ts
{
	path: 'expedientes',
	loadChildren: () => import('./features/expedientes/expedientes.routes')
		.then(m => m.routes),
	canActivate: [authGuard],
}
```

Por ello, tanto lectores como editores necesitan iniciar sesión antes de abrir el listado, buscar o filtrar.

### rolGuard

`rolGuard` autoriza únicamente a editores:

```ts
export const rolGuard: CanActivateFn = () => {
	return inject(AuthService).esUsuarioEditor();
};
```

Se añade solo a las rutas de detalle de la feature:

```ts
{ path: ':numero', component: ExpedienteDetallePage, canActivate: [rolGuard] },
{
	path: ':numero/editar',
	component: ExpedienteDetallePage,
	canActivate: [rolGuard],
	data: { modo: 'editar' },
}
```

Un lector puede cargar `/expedientes`, pero Angular no activa `/expedientes/:numero` porque `rolGuard` devuelve `false`.

## Token e interceptor HTTP

`authTokenInterceptor` se registra con `provideHttpClient(withInterceptors(...))`. Antes de enviar cada petición, clona la petición y añade el token en la cabecera `Authorization`:

```ts
const authReq = req.clone({
	headers: req.headers.set('Authorization', `Bearer ${token}`),
});
```

Si la API responde `401` (sesión no válida o caducada), el interceptor cierra la sesión y navega al login, conservando la ruta actual:

```ts
const urlActual = router.url;
authService.logout();
router.navigate(['/login'], { queryParams: { returnUrl: urlActual } });
```

El código actual deja que el error continúe por el flujo RxJS después de esta navegación. Esto permite que el componente que hizo la petición decida cómo presentarlo, si lo necesita.

Un `403` significa que el usuario está autenticado pero no tiene permiso para la operación solicitada. El interceptor mock ya devuelve `403` cuando el rol no está permitido. La aplicación todavía no muestra un aviso global específico para ese estado; añadirlo sería el siguiente paso para completar el manejo visual de permisos denegados.

## Permisos en la interfaz

La autorización no debe estar solo en los guards: la interfaz debe evitar ofrecer acciones que el usuario no puede ejecutar. Estas comprobaciones mejoran la experiencia, pero no sustituyen las validaciones de ruta ni de API.

El header solo muestra la navegación, el usuario y el botón de salida si `estaAutenticado()` es verdadero:

```html
@if (autenticado()) {
	<nav aria-label="Navegación principal">
		<a routerLink="/expedientes">Expedientes</a>
	</nav>
	<button matButton type="button" (click)="logout.emit()">Salir</button>
}
```

El listado calcula sus columnas según `esUsuarioEditor()`. Para un lector no incluye `opciones`, por lo que tampoco se representa el botón `Consultar`; un editor sí puede seleccionarlo y navegar al detalle.

## Ejercicio de consolidación

Para practicar el flujo completo:

1. Inicia sesión como `user` y comprueba que puedes buscar y filtrar, pero no ves el botón de consulta ni puedes abrir un detalle por URL.
2. Inicia sesión como `admin` y comprueba que ves el botón de consulta y puedes acceder a detalle y edición.
3. Borra `tienda-online.sesion` desde Local Storage y solicita datos: la respuesta `401` debe cerrar la sesión y llevarte al login con `returnUrl`.
4. Comprueba que las respuestas `403` de la API mock se producen para permisos insuficientes. Como mejora, implementa un aviso accesible para ese caso.
