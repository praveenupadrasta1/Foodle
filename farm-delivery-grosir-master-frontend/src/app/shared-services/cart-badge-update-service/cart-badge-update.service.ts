import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import * as keys from '../../utils/json-keys';
import * as customLocalStorage from '../../utils/local-storage';
import { getFromSession } from '../../utils/session-storage';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class CartBadgeUpdateService {

  totalProducts = 0;
  private currentCityCart: any;
  private currentDeliveryCity: string;
  private currentUserProfile = null;

  private messageSource = new BehaviorSubject(this.totalProducts);
  currentData = this.messageSource.asObservable();

  constructor(private angularFireAuth: AngularFireAuth) { }

  updateCartBadge(){
    this.angularFireAuth.auth.onIdTokenChanged((user) => {
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
      }
      else{
        this.currentUserProfile = null;
      }
      let total = 0;
      if(this.currentUserProfile){
        let selectedDeliveryData = getFromSession('selectedDeliveryData');
        if(selectedDeliveryData){
          this.currentDeliveryCity = selectedDeliveryData.city;
          let cart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
          if(cart){
            this.currentCityCart = cart;
            total = this.getTotalProductsInCart();
          }
          this.messageSource.next(total);
        }
        else{
          this.totalProducts = 0;
        }
      }
      else{
        this.totalProducts = 0;
      }
    });
  }

  getTotalProductsInCart(){
    // Each key corresponds to each product. Thus number of keys = number of products
    return Object.keys(this.currentCityCart[keys.line_items]).length;
  }
}
