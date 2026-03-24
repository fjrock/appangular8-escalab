import { Component, OnDestroy, OnInit} from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent implements OnInit {

    form: UntypedFormGroup;
    error = false;
    mensajeError: any;

    constructor(private formBuilder: UntypedFormBuilder, 
                private router: Router,
                private loginService: LoginService
                ) 
    {
      this.createForm();
    }
  
    ngOnInit() {
      this.error=false;
    }
  
    async login(form: any) {
      if (!this.form.valid) {
        return;
      }

      this.error = false;
      this.mensajeError = '';

      try {
        await this.loginService.login(form);
        this.router.navigate(['/admin']);
      } catch (err: any) {
        this.error = true;
        this.mensajeError = this.getFirebaseErrorMessage(err);
        this.createForm();
      }
    }

    private createForm(): void {
      this.form = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password: ['', [Validators.required]],
      });
    }

    private getFirebaseErrorMessage(error: any): string {
      const code = error?.code || '';
      switch (code) {
        case 'auth/user-not-found':
          return 'No existe un usuario con ese correo.';
        case 'auth/wrong-password':
          return 'La contrasena es incorrecta.';
        case 'auth/invalid-email':
          return 'El correo no tiene un formato valido.';
        case 'auth/too-many-requests':
          return 'Demasiados intentos. Intenta nuevamente en unos minutos.';
        default:
          return 'No fue posible iniciar sesion. Verifica tus credenciales.';
      }
    }

  }