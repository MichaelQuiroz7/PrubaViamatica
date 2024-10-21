import { User } from './../../Interfaces/user';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../Services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router, private toastr:ToastrService, private userServices:UserService, private errorService:ErrorService){}
  loading:boolean = false;
  sEmail: string = '';  
  sPasword: string = ''; 

 

  login() {
    if(!this.sEmail|| !this.sPasword){
      this.toastr.error('Por favor ingrese el correo electrónico y la contraseña', 'Error');
      return;
    }
  
    const user:User={
      sEmail: this.sEmail,
      sPassword: this.sPasword,
      sNameUser: '',
      sLastNameUser: '',
      sAddressUser: '',
      sPhoneNumber: ''
    }

    this.userServices.login(user).subscribe({
      next: (data) => {
        this.loading = false;
        this.toastr.success(`Bienvenido`, 'Credenciales Validadas!');
        localStorage.setItem('token', data);
        this.router.navigate(['/dashboard']);
        
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      }});

  }
}
