import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly loginModel = signal({
    user: '',
    pass: '',
  });

  readonly loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.user, { message: 'El usuario es obligatorio' });
      required(schemaPath.pass, { message: 'La contraseña es obligatoria' });
    },
    {
      submission: {
        action: async (model) => {
          try {
            await firstValueFrom(this.authService.login(model().value()));
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            const destino = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
              ? returnUrl
              : '/expedientes';

            await this.router.navigateByUrl(destino);
            return;
          } catch {
            return {
              kind: 'credentials',
              message: 'Usuario o contraseña incorrectos',
              fieldTree: model.pass,
            };
          }
        },
      },
    },
  );
}
