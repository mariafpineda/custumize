import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AdminsService } from 'src/app/services/admins.service';


@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

  errorMessage:String;
  errorBool:Boolean;

  formularioLoginAdmin = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasenia: new FormControl('', [Validators.required])
  });

  constructor(private adminsService:AdminsService,
    private router:Router,
    private titleService:Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Iniciar sesión');
  }

  guardarAdmin(){
    if(!this.formularioLoginAdmin.valid){
      this.errorMessage="Todos los campos son obligatorios";
      this.errorBool=true;
    } else {
      this.adminsService.signIn(this.formularioLoginAdmin.value)
      .subscribe(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('idAdmin', res.idAdmin);
        this.router.navigate(['/admin/home']);
      }, error => {
        this.errorBool=true;
        this.errorMessage=error.error.message
    })
    }
    setTimeout(() => {
      this.errorBool=false;
    }, 5000);
    
  }


}
