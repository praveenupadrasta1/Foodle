import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, IonSelect } from '@ionic/angular';

import * as config from '../../utils/config';
import { CartBadgeUpdateService } from 'src/app/shared-services/cart-badge-update-service/cart-badge-update.service';
import { getFromSession } from '../../utils/session-storage';
import { NetworkChangeDelegationService } from '../../shared-services/network-change-delegation/network-change-delegation.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  categoryName: string;
  categoryId: string;
  filterType: string;
  filterOptions = [];
  isOnline = true;
  doRefresh = false;
  isBrowser = true;
  
  constructor(private route: ActivatedRoute,
              private router: Router,
              private networkChangeDelegationService: NetworkChangeDelegationService,
              private cartBadgeUpdateService: CartBadgeUpdateService,
              private platform: Platform) { 
                // When the page refreshes, initialise the cart badge update service again and update the badge
                this.cartBadgeUpdateService.updateCartBadge();
  }
  
  @ViewChild('filterSelect') filterRef: IonSelect;

  ngOnInit() {
    this.networkChangeDelegationService.currentData.subscribe(isOnline => {
      this.isOnline = isOnline;
      if(this.isOnline){
        this.doRefresh = true;
      }
      else{
        this.doRefresh = false;
      }
    });

    let selectedDeliveryData = getFromSession('selectedDeliveryData');
    if(selectedDeliveryData){
      this.filterOptions = config.filterOptions;
      this.filterType = this.filterOptions[0];
      let paramCategoryNameId = this.route.snapshot.paramMap.get('id');
      this.categoryName = paramCategoryNameId.split('_')[0];
      this.categoryId = paramCategoryNameId.split('_')[1];
    }
    else{
      this.router.navigate(['/home']);
    }
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

  goToSearch(){
    this.router.navigate(['/gsearch']);
  }

  onChange(filterBy){
    this.filterType = filterBy;
  }

  showFilterOptions(){
    this.filterRef.open();
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
