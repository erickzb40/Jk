import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
usuario='';
  constructor(public rout: Router) { }

  ngOnInit(): void {
    this.usuario=localStorage.getItem('user');
  }
  salir(){
    localStorage.removeItem('token');
    this.rout.navigateByUrl('login');
  }
  login() {
    this.rout.navigateByUrl('/login');
   }

}
