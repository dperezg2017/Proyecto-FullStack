import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Inicias Sesion!'
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()){
      swal.fire(
        'Login',
        `Hola ${this.authService.usuario.username} ya estas autenticado! `,
        'info'
      )
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      swal.fire(
        'Error Login',
        `Username o password vacías! `,
        'error'
      )
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      // let payload = JSON.parse(atob(response.access_token.split(".")[1]));
      // console.log(payload);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      this.router.navigate(['/clientes']);
      let usuario = this.authService.usuario;
      swal.fire(
        'Login',
        `Hola ${usuario.username}, has iniciado sesion con éxito!`,
        'success'
      );

    }, err=>{
      if(err.status==400){
        swal.fire(
          'Error Login',
          `Username o clave incorrectas!`,
          'error'
        );
      }
    }
  );

  }
}
