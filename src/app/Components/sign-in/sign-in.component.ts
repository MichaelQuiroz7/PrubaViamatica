import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { User } from '../../Interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../Services/error.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  registroForm: FormGroup;
  editMode: boolean = false;
  userId: number | null = null;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute, private errorService:ErrorService) {
    this.registroForm = this.fb.group({
      sNameUser: ['', [Validators.required]],
      sLastNameUser: ['', [Validators.required]],
      sPassword: ['', [Validators.required]],
      sPasswordConfirmated: ['', [Validators.required]],
      sEmail: ['', [Validators.required, Validators.email]],
      sPhoneNumber: ['', [Validators.required]],
      sAddressUser: ['', [Validators.required]]
    });
  }

  onBack() {
    if (this.editMode) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }


  ngOnInit(): void {
    this.route.url.subscribe(url => {
      if (url[0].path === 'user') {
        this.editMode = true;
        this.loadUserData();
      }
    });
  }


  


  loadUserData() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.toastr.error('Error de sesión: no se encontró el token.');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return;
    }
  
    let userId: number | null = null;
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.userId;
    } catch (error) {
      this.toastr.error('Error al decodificar el token.');
      return;
    }
  
    if (!userId) {
      this.toastr.error('No se encontró el usuario en el token.');
      return;
    }
  
    this.userService.getUserData(userId).subscribe({
      next: (data: {nIdUser:number, sNameUser: string; sLastNameUser: string; sEmail: string; sPhoneNumber: string; sAddressUser: string; }) => {
        console.log(data);
        if (data) {
          this.registroForm.patchValue({
            sNameUser: data.sNameUser,
            sLastNameUser: data.sLastNameUser,
            sEmail: data.sEmail,
            sPhoneNumber: data.sPhoneNumber,
            sAddressUser: data.sAddressUser
          });
          
          this.registroForm.get('sNameUser')?.disable();
          this.registroForm.get('sLastNameUser')?.disable();
          this.registroForm.get('sEmail')?.disable();
        } else {
          this.toastr.error('No se encontraron datos del usuario.');
        }
      },
      error: (error: any) => {
        this.toastr.error('Error al cargar los datos del usuario.');
        console.error('Error al cargar los datos del usuario:', error);
      },
      complete: () => console.info('Datos del usuario cargados completamente')
    });
  }
  
  

  passwordsMatch(): boolean {
    const password = this.registroForm.get('sPassword')?.value;
    const confirmPassword = this.registroForm.get('sPasswordConfirmated')?.value;
    return password === confirmPassword;
  }

  onSubmit() {
    if (this.registroForm.invalid || !this.passwordsMatch()) {
      this.toastr.error('Complete todos los campos', 'Error!');
      return;
    }

    const user: User = {
      sNameUser: this.registroForm.value.sNameUser,
      sLastNameUser: this.registroForm.value.sLastNameUser,
      sEmail: this.registroForm.value.sEmail,
      sPassword: this.registroForm.value.sPasswordConfirmated,
      sAddressUser: this.registroForm.value.sAddressUser,
      sPhoneNumber: this.registroForm.value.sPhoneNumber
    };

    if (this.editMode) {
      this.updateUser(user);
    } else {
      this.registerUser(user);
    }
  }

  registerUser(user:User) {
    this.loading = true;
    this.userService.SignIn(user).subscribe({
      next: (v) => {
        this.toastr.success(`Se ha resigtrado el usuario ${user.sNameUser}`, 'Usuario Agregado!');
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        this.errorService.msjError(e);
        this.loading = false;
      },
      complete: () => console.info('complete')
    });
  }

 
  updateUser(user:User) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastr.error('Error de sesión: no se encontró el token.');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return;
    }
  
    let userId: number | null = null;
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.userId;
    } catch (error) {
      this.toastr.error('Error al decodificar el token.');
      return;
    }
  
    if (!userId) {
      this.toastr.error('No se encontró el usuario en el token.');
      return;
    }
  
    
  
    this.userService.updateUser(userId, user).subscribe({
      next: () => {
        this.toastr.success('Datos actualizados con éxito');
      },
      error: (err) => {
        this.toastr.error('Error al actualizar los datos', 'Error!');
      },
      complete: () => {
        console.log('Actualización completada');
      }
    });
  }
  




}

