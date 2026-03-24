import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService} from '../../services/login.service'

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
  
  constructor(private loginService: LoginService, 
              private router: Router) {

  }

  canActivate(): Observable<boolean> {
    
    return this.loginService.userLogin$
      .pipe(map(userLogin => {
          if (!userLogin) {
            this.router.navigate(['home']);
            return false;
          } else{
          return true;
          }
      })
    );
  }
  
}