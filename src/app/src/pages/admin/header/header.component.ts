import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
usuario='';
  constructor() { }

  ngOnInit(): void {
    this.usuario=localStorage.getItem('token');
  }

}
