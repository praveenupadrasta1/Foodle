import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicImageLoader } from 'ionic-image-loader';
import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DeliveryAreaDateTimeDataService } from './shared-services/delivery-area-date-time-data/delivery-area-date-time-data.service';
import { SearchProductGlobalService } from './api/search-product-global/search-product-global.service';
import { ToastService } from './shared-services/toast-service/toast.service';
import { CartBadgeUpdateService } from './shared-services/cart-badge-update-service/cart-badge-update.service';
import { UpdateProductQuantityService } from './shared-services/update-product-quantity/update-product-quantity.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { FirebaseAuthProviderService } from './api/authentication/firebase-auth-provider.service';
import { UpdateFeaturedProductsService } from './shared-services/update-featured-products/update-featured-products.service';
import { NetworkChangeDelegationService } from './shared-services/network-change-delegation/network-change-delegation.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { Firebase } from '@ionic-native/firebase/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { environment } from 'src/environments/environment';
// import { ScrollHideDirective } from './directives/scroll-hide/scroll-hide.directive';
import { FcmService } from './api/fcm/fcm.service';
import { BannerInfoDeliverService } from './shared-services/banner-info-deliver/banner-info-deliver.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({ swipeBackEnabled: false,
                          scrollAssist: false
                          }),
    IonicImageLoader.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireAnalyticsModule
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    // FCM,
    Firebase,
    FcmService,
    DeliveryAreaDateTimeDataService,
    SearchProductGlobalService,
    ToastService,
    CartBadgeUpdateService,
    UpdateProductQuantityService,
    UpdateFeaturedProductsService,
    NetworkChangeDelegationService,
    BannerInfoDeliverService,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    InAppBrowser,
    GoogleAnalytics
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  
}
