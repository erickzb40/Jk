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

  cargando: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, public auth: AuthService) { }

  ngOnInit(): void {
  }

  login(form: NgForm) {
    console.log(form.form.value.nombreUsuario);
    if (form.invalid) { return; }
    this.auth.login(form.form.value).pipe(finalize(()=>{
    })).subscribe(res=>{
      if(Object.entries(res).length>0){
       this.router.navigateByUrl('empleado');
      }else{
       Swal.fire({
        title:'Mensaje',
        icon:'warning',
        text:'No se encontro ningun usuario'
       })
      }
    });

  }

}
