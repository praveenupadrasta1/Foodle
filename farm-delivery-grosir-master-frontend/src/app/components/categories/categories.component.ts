import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import * as keys from '../../utils/json-keys';
import { GetCategoriesNFeaturedProductsService } from '../../api/get-categories-n-featured-products/get-categories-n-featured-products.service';
import { getFromSession } from '../../utils/session-storage';
import { DeliveryAreaDateTimeDataService } from '../../shared-services/delivery-area-date-time-data/delivery-area-date-time-data.service';
import { UpdateFeaturedProductsService } from '../../shared-services/update-featured-products/update-featured-products.service';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnChanges {

  @Input() doRefresh: boolean;
  
  categories = [];
  generatedDateTime: any;
  isDesktop = false;
  isLoading = true;

  constructor(private getCategoriesNFeaturedProductsService: GetCategoriesNFeaturedProductsService,
              private deliveryArea: DeliveryAreaDateTimeDataService,
              private platform: Platform,
              private router: Router,
              private toast: ToastService,
              private updateFeaturedProductsService: UpdateFeaturedProductsService) { }

  ngOnChanges(){
    this.ngOnInit();
  }

  ngOnInit() {
    if(this.platform.is('desktop')){
      this.isDesktop = true;
    }

    this.populateData();

    // Subscribe to city change event through shared service
    this.deliveryArea.currentData.subscribe(deliveryData => {
      let deliveryCity = deliveryData.city;
      if(deliveryCity){
        this.populateData();
      }
    });
  }

  populateData(){
    this.getCategoriesNFeaturedProductsFromFirestore();
  }

  getCategoriesNFeaturedProductsFromFirestore() {
    this.categories = [];
    this.isLoading = true;
    this.getCategoriesNFeaturedProductsService.getCategoriesNFeaturedProducts().subscribe((res) => {
      this.filterCategoriesOfCurrentDeliveryCity(res);
      this.isLoading = false;
    },
    error => {
      this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
      this.isLoading = false;
    });
  }

  filterCategoriesOfCurrentDeliveryCity(res){
    let selectedDeliveryData = getFromSession('selectedDeliveryData');
    if(selectedDeliveryData){
      let selectedDeliveryCity = selectedDeliveryData.city;
      this.categories = [];
      for(let category of res.data){
        if(category.cities.length > 0){
          let categoryIndex = category.cities.indexOf(selectedDeliveryCity);
          if(categoryIndex > -1 && category.is_visible){
            this.categories.push(category);
          }
        }
      }
      let updatedData = {
        'categories': this.categories,
        'featured_products': res.featured_products
      }
      this.updateFeaturedProductsService.updateCategoriesNProductsData(updatedData);
    }
  }

  openProductsPage(categoryName, categoryId){
    this.router.navigate(['/products/' + categoryName + '_' + categoryId]);
  }
}
