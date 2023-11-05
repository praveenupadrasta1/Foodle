import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';

import { AngularFirestore } from 'angularfire2/firestore';
import { Firebase } from '@ionic-native/firebase/ngx';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(public firebaseNative: Firebase,
              public angularFirestore: AngularFirestore,
              public platform: Platform) { }
  
  async getToken(){
    let token;

    if(this.platform.is('android')){
      token = await this.firebaseNative.getToken();
    }

    if(!(this.platform.is('cordova'))){

    }

    return this.saveTokenToFirestore(token);
  }

  saveTokenToFirestore(token){
    if(!token) return;

    const devicesRef = this.angularFirestore.collection('devices');
    const docData = {
      token,
      userId: 'Guest'
    }

    return devicesRef.doc(token).set(docData);
  }

  listenToNotifications(){
    return this.firebaseNative.onNotificationOpen();
  }
}
