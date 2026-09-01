import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormField, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);

  loginModel = signal({
    usuario: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.usuario, { message: 'El usuario es obligatorio' });
    required(schemaPath.password, { message: 'La contraseña es obligatoria' });
  });

  login() {
    console.log('Login data de prueba:', this.loginModel());
    console.log(
      'Login form de prueba:',
      this.loginForm.usuario().value() + '-' + this.loginForm.password().value(),
    );

    this.router.navigate(['/expedientes']);
  }
}
