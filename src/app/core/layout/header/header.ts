import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly titulo = 'Gestor de expedientes';
  private readonly authService = inject(AuthService);

  readonly autenticado = this.authService.estaAutenticado;
  readonly nombreUsuarioAutenticado = this.authService.nombreUsuarioAutenticado;
  readonly logout = output<void>();
}
