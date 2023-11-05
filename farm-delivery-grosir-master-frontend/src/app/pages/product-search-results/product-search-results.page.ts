import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { getFromSession } from '../../utils/session-storage';
import { CartBadgeUpdateService } from 'src/app/shared-services/cart-badge-update-service/cart-badge-update.service';
import { NetworkChangeDelegationService } from '../../shared-services/network-change-delegation/network-change-delegation.service';

@Component({
  selector: 'app-product-search-results',
  templateUrl: './product-search-results.page.html',
  styleUrls: ['./product-search-results.page.scss'],
})
export class ProductSearchResultsPage implements OnInit {

  key: string;
  isBarcodeSearch: number;
  isOnline = true;
  doRefresh = false;
  isBrowser = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private networkChangeDelegationService: NetworkChangeDelegationService,
              private cartBadgeUpdateService: CartBadgeUpdateService,
              private platform: Platform) { 
                this.cartBadgeUpdateService.updateCartBadge();  
              }

  ngOnInit() {
    let selectedDeliveryData = getFromSession('selectedDeliveryData');
    if(selectedDeliveryData){
      this.key = this.route.snapshot.paramMap.get('key');
      this.isBarcodeSearch = +this.route.snapshot.paramMap.get('is_barcode_search');
    }
    else{
      this.router.navigate(['/home']);
    }

    this.networkChangeDelegationService.currentData.subscribe(isOnline => {
      this.isOnline = isOnline;
      if(this.isOnline){
        this.doRefresh = true;
      }
      else{
        this.doRefresh = false;
      }
    });
    this.setPlatformType();
  }

  setPlatformType(){
    if(this.platform.is('mobileweb') || this.platform.is('desktop')){
      this.isBrowser = true;
    }
    else{
      this.isBrowser = false;
    }
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
}
