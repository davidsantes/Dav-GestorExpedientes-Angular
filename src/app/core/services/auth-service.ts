import { computed, inject, Service, signal } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../features/auth/models/auth.interface';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { leerToken } from '../auth/token.util';

const SESSION_KEY = 'gestor-expedientes.sesion';

@Service()
export class AuthService {
    httpClient = inject(HttpClient);

    session = signal<LoginResponse | null>(this.recuperarSesion());

    estaAutenticado = computed(() => this.session() !== null);
    nombreUsuarioAutenticado = computed(() => this.session()?.user ?? null);
    esUsuarioEditor = computed(() => this.session()?.rol == 'EDITOR');

    login(credenciales: LoginRequest): Observable<LoginResponse>{
        return this.httpClient.post<LoginResponse>('/api/auth/login', credenciales).pipe(
            tap((response) => this.guardarSesion(response))
        )
    }

    logout(): void {
        this.session.set(null);
        this.almacenamientoLocal()?.removeItem(SESSION_KEY);
    }

    private guardarSesion(response: LoginResponse): void {
        if (!leerToken(response.token)) throw new Error('Token inválido');
        this.session.set(response);
        this.almacenamientoLocal()?.setItem(SESSION_KEY, JSON.stringify(response));
    }

    private recuperarSesion(): LoginResponse | null {
        const sesionAlmacenada = this.almacenamientoLocal()?.getItem(SESSION_KEY);
        if (!sesionAlmacenada) return null;

        try {
            return JSON.parse(sesionAlmacenada) as LoginResponse;
        } catch {
            this.almacenamientoLocal()?.removeItem(SESSION_KEY);
            return null;
        }
    }

    private almacenamientoLocal(): Storage | null {
        if (typeof window === 'undefined') {
            return null;
        }

        try {
            return window.localStorage ?? null;
        } catch {
            return null;
        }
    }
}
