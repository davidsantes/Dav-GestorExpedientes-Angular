import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  router = inject(Router);
  
  loginModel = signal({
    usuario: '',
    password: ''
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.usuario, { message: 'El usuario es obligatorio' });
    required(schemaPath.password, { message: 'La contraseña es obligatoria' });
  });

  login() {
    console.log('Login data de prueba:', this.loginModel());
    console.log('Login form de prueba:', this.loginForm.usuario().value() + '-' + this.loginForm.password().value());

    this.router.navigate(['/expedientes']);
  }
}