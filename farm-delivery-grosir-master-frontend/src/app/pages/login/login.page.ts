import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
// import { FirebaseAuthProviderService } from '../../api/authentication/firebase-auth-provider.service';
// import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private unsubscribe;
  constructor(public navCtrl: NavController
            , private router: Router
            , private angularFireAuth: AngularFireAuth
            , private platform: Platform) {
              
              this.platform.backButton.subscribeWithPriority(10, () => {
                this.router.navigate(['/home']);
              });
  }
  
  ngOnInit() {
  }

  // ionViewDidEnter() {
  //   console.log('here');
  //   this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged(user => {
  //     if(user){
  //       // this.router.navigate(['/home']);
  //       console.log(user);
  //     }
  //     // else{
  //     //   this.authProvider.ui.start('#firebaseui-auth-container', FirebaseAuthProviderService.getUiConfig());
  //     // }
  //     });
  // }

  ngOnDestroy() {
    // this.unsubscribe();
  }
}
