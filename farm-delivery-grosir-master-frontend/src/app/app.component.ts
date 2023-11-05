import { Component, OnInit, OnDestroy } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import firebase from 'firebase/app';
// import 'firebase/auth';

// import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';

import { ToastService } from './shared-services/toast-service/toast.service';
import { NetworkChangeDelegationService } from './shared-services/network-change-delegation/network-change-delegation.service';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';

import { FcmService } from './api/fcm/fcm.service';
import { tap } from 'rxjs/operators';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  username = '';

  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Ketentuan Penggunaan',
      url: '/terms-of-service',
      icon: 'document-text'
    },
    {
      title: 'Privasi dan Kebijakan',
      url: '/privacy-policy',
      icon: 'document-text'
    },
    {
      title: 'Kebijakan pengembalian',
      url: '/refund-policy',
      icon: 'document-text'
    },
    {
      title: 'Contact Us',
      url: '/contact-us',
      icon: 'call'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toast: ToastService,
    // private fcm: FCM,
    private fcmService: FcmService,
    private router: Router,
    private networkChangeDelegationService: NetworkChangeDelegationService,
    private angularFireAuth: AngularFireAuth,
    private ga: GoogleAnalytics) {
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // this.ga.startTrackerWithId('G-FEBTRC6PK8')
      // .then(() => {
      //   console.log('Google analytics is ready now');
      //   this.ga.trackView('Outbox') 
      //   .then(() => {

      //   })
      //   .catch(
      //     error => console.log(error)
      //   );  
      //  }).catch(
      //   error => console.log('Google Analytics Error: ' + error)
      // );
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    /**
    * Get the online/offline status from browser window
    */
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.subscriptions.push(this.onlineEvent.subscribe(e => {
      this.networkChangeDelegationService.updateNetworkStatus(true);
      if(!this.toast)
      {
        this.toast.showToast('Anda kembali online!', 5000, 'darkgreen');
      }
      else{
        this.toast.hideToast();
        this.toast.showToast('Anda kembali online!', 5000, 'darkgreen');
      }
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
      this.networkChangeDelegationService.updateNetworkStatus(false);
        if(!this.toast)
        {
          this.toast.showToast('Anda sedang offline! Silakan periksa koneksi internet Anda!', 10000, 'dark');
        }
        else{
          this.toast.hideToast();
          this.toast.showToast('Anda sedang offline! Silakan periksa koneksi internet Anda!', 10000, 'dark');
        }
    }));

    // this.angularFireAuth.auth.onIdTokenChanged((user) => {
    //   if(user)
    //   {
    //     this.username = JSON.parse(JSON.stringify(user)).displayName;
    //   }
    //   else{
    //     this.username = 'Guest';
    //   }
    // });

    this.angularFireAuth.auth.onIdTokenChanged((user) => {
      if(user)
      {
        this.username = JSON.parse(JSON.stringify(user)).displayName;
      }
      else{
        this.username = 'Guest';
      }
    });
   
    // this.fcm.getToken().then(token => {
    //   // this.toast.showToast(token, 10000, 'dark');
    //   console.log(token);
    // });

    // this.fcm.onTokenRefresh().subscribe(token => {
    //   // this.toast.showToast(token, 10000, 'dark');
    //   console.log(token);
    // });

    // this.fcm.onNotification().subscribe(data => {
    //   console.log(data);
    //   if (data.wasTapped) {
    //     console.log('Received in background', data);
    //     // this.router.navigate([data.landing_page, data.price]);
    //   } else {
    //     console.log('Received in foreground', data);
    //     // this.router.navigate([data.landing_page, data.price]);
    //   }
    // });
  }

  // trackEvent(val) {
  //   // Label and Value are optional, Value is numeric
  //   this.ga.trackEvent('Category', 'Action', 'Label', val)
  // }  

  ionViewDidLoad(){
    // this.fcmService.getToken();
    // this.fcmService.listenToNotifications().pipe(
    //   tap(msg => {
    //     this.toast.showToast(msg, 3000, 'darkgreen');
    //   })
    // );
  }

  ngOnDestroy(): void {
    /**
    * Unsubscribe all subscriptions to avoid memory leak
    */
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
