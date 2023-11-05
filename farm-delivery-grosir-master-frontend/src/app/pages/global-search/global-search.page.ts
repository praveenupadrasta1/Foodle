import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { GetCategoriesService } from '../../api/categories/get-categories.service';
import { getCurrentDateTime } from '../../utils/date-time';
import { storeInSession, getFromSession, removeFromSession } from '../../utils/session-storage';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.page.html',
  styleUrls: ['./global-search.page.scss'],
})
export class GlobalSearchPage implements OnInit, OnDestroy {

  categories = [];
  generatedDateTime: any;
  isDesktop = false;
  searchedKeys = [];

  constructor(private getCategoriesService: GetCategoriesService,
              private platform: Platform,
              private router: Router,
              private loadingController: LoadingController) { }

  ngOnInit() {

    let sessionSearchedKeys = this.getSearchedKeysFromSession();
    if(sessionSearchedKeys){
      this.searchedKeys = sessionSearchedKeys;
    }
    let selectedDeliveryData = getFromSession('selectedDeliveryData');
    if(selectedDeliveryData){
      this.populateCategoryData();
    }
    else{
      this.router.navigate(['/home']);
    }
  }

  @HostListener('unload')
  ngOnDestroy(){

  }

  searchProduct(key){
    if(key.toString().length > 0){
      if(!(this.searchedKeys.includes(key))){
        this.searchedKeys.push(key);
        storeInSession('searched_keys', this.searchedKeys);
      }
      (<HTMLInputElement>document.getElementById('search-global')).value = '';
      this.router.navigate(['/search_results/'+key+'/0']);
    }
  }

  populateCategoryData(){
    this.getCategoriesFromFirestore();
  }

  async getCategoriesFromFirestore() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      spinner: null,
      // message: 'Please wait...'
    });
    await loading.present();
    this.getCategoriesService.getCategories().subscribe((res) => {
      storeInSession('categories', res);

      this.filterCategoriesOfCurrentDeliveryCity(res)
      loading.dismiss();
    },
    error => {
      loading.dismiss();
      // this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
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
    }
  }

  getSearchedKeysFromSession(){
    return getFromSession('searched_keys');
  }

  openProductsPage(categoryName, categoryId){
    this.router.navigate(['products/' + categoryName + '_' + categoryId]);
  }
}
