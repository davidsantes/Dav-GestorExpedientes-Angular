import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  router = inject(Router);
  
  usuario: string = "";
  password: string = "";

  login() {
    console.log("Usuario: " + this.usuario);
    console.log("Password: " + this.password);

    //Llamo al servidor de autenticación para validar el usuario y la contraseña
    this.router.navigate(['/expedientes']);
  }
}
