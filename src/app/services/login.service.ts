import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public userLogin$: Observable<firebase.User>;

  constructor(private AngularFireAuth: AngularFireAuth) { 
    this.userLogin$ = AngularFireAuth.authState;
  }

  login(user: any) {
    const { email, password } = user;
    return this.AngularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.AngularFireAuth.signOut();
  }

}




