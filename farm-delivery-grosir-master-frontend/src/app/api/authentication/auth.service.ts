import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, throwError } from 'rxjs';
import { map, catchError, first } from 'rxjs/operators';
import * as config from '../../utils/config';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  httpHeaders = { headers: new HttpHeaders({
    "Content-Type": "application/json"
    })
  }

  options = {
    headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Accept": "application/json",
    })
  }

  constructor(private http: HttpClient,
              public afAuth: AngularFireAuth) {}

  getCookie(name) {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  postIdTokenToSessionLogin(idToken) {
    const csrfToken = this.getCookie('csrfToken');
    let body = {
      "idToken": idToken,
      "csrfToken": csrfToken
    }
    return this.http.post(config.firebaseApiBaseUrl + '/v1/login/session_token/', body, this.options)
    .pipe(map(response => response),
        catchError(err => {
          return throwError(err);
      }));
  }

  verifyToken(idToken){
    return this.http.get(config.firebaseApiBaseUrl + '/v1/login/verify_token/', this.httpHeaders)
      .pipe(map(response => response),
      catchError(err => {
        return throwError(err);
    }));
  }

  createBCCustomer(accessToken){
    let options = {
      headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Bearer " + accessToken
      })
    }
    return this.http.get(config.firebaseApiBaseUrl + '/v1/create-customer-bc/', options)
    .pipe(map(response => response),
      catchError(err => {
      return throwError(err);
    }));
  }

  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email/password
  RegisterUser(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  // Email verification when new user register
  SendVerificationMail() {
    return new Promise((resolve, reject)=>{
      this.afAuth.authState.pipe(first()).toPromise().then(user=>{
        
          resolve(user.sendEmailVerification());
      }).catch(error=>{
          reject(error);
      });
    });
  }

  // Recover password
  PasswordRecovery(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  // Returns true when user is looged in
  get isLoggedIn(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    this.afAuth.authState.pipe(first()).toPromise().then(user=>{
      return user.emailVerified;
    }).catch(error=>{
      return false;
    });
    return false;
  }

  //  Login with Google account
  async webGoogleLogin() {
    try{
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      return credential;
    } catch(error)  {
      // console.log(error);
    }
  }

  // Sign-out 
  SignOut() {
    return this.afAuth.auth.signOut();
  }

}