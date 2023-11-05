import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Platform } from '@ionic/angular';

import { CartBadgeUpdateService } from 'src/app/shared-services/cart-badge-update-service/cart-badge-update.service';
import { NetworkChangeDelegationService } from '../../shared-services/network-change-delegation/network-change-delegation.service';
// import { ScrollHideConfig } from '../../directives/scroll-hide/scroll-hide.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isOnline = true;
  mySubscription: any;
  doRefresh = false;
  isBrowser = true;
  // footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  // headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 54 };

  constructor(private cartBadgeUpdateService: CartBadgeUpdateService,
              private networkChangeDelegationService: NetworkChangeDelegationService,
              private router: Router,
              private platform: Platform) { }

  ngOnInit() {
    this.setPlatformType();
    this.networkChangeDelegationService.currentData.subscribe(isOnline => {
      this.isOnline = isOnline;
      if(this.isOnline){
        this.doRefresh = true;
      }
      else{
        this.doRefresh = false;
      }
    });
    this.cartBadgeUpdateService.updateCartBadge();
  }

  refresh(){
    this.ngOnInit();
  }

  refreshPage(event){

    setTimeout(() => {
      this.doRefresh = !this.doRefresh;
      event.target.complete();
    }, 2000);
  }

  setPlatformType(){
    if(this.platform.is('mobileweb') || this.platform.is('desktop')){
      this.isBrowser = true;
    }
    else{
      this.isBrowser = false;
    }
  }
}
