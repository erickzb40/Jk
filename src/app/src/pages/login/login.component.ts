import { empty, finalize } from 'rxjs';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario = {
    nombreUsuario: '',
    contrasena: ''
  }
  recordarme = false;

  cargando: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.usuario.nombreUsuario = localStorage.getItem('user');
      this.recordarme=true;
    }
  }

  login(form: NgForm) {
    Swal.fire({
      title: 'Cargando...',
      focusCancel:false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    console.log(form.form.value.nombreUsuario);
    if (form.invalid) { return; }
    this.auth.login(form.form.value).pipe(finalize(() => {
    })).subscribe(res => {
      if (Object.entries(res).length > 0) {
        if (this.recordarme) {localStorage.setItem('user', this.usuario.nombreUsuario); }
        Swal.close();
        localStorage.setItem('token',this.usuario.nombreUsuario);
        this.router.navigateByUrl('admin');
      } else {
        Swal.fire({
          title: 'Mensaje',
          icon: 'warning',
          text: 'No se encontro ningun usuario'
        })
      }
    }, err => {
      Swal.fire({ icon: 'warning', text: 'hubo un error en la conexion al servidor' });
    });

  }

}
