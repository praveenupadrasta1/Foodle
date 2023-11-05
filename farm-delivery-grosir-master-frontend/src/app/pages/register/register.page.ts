import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
// import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  private unsubscribe;
  constructor(private router: Router,
              private angularFireAuth: AngularFireAuth,
              private platform: Platform) { }

  ngOnInit() {
  }

  // ionViewDidEnter() {
  //   this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged(user => {
  //     if(user){
  //       this.router.navigate(['/home']);
  //     }
  //     // else{
  //     //   this.authProvider.ui.start('#firebaseui-auth-container', FirebaseAuthProviderService.getUiConfig());
  //     // }
  //     });
  // }

  // ngOnDestroy() {
  //   this.unsubscribe();
  // }

}
