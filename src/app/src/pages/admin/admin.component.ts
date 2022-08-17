import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  asistencia : any=[];
  p: number = 1;
  constructor(public aut:AuthService) { }

  ngOnInit(): void {
  this.aut.obtenerAsistencia().pipe(finalize(()=>{
  })).subscribe((res:any[])=>{
    this.asistencia=res;
    console.log(res);
  });
  }



}
