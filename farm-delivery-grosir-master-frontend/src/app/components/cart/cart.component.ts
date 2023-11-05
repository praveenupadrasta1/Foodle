import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { FirebaseAuthModalComponent } from '../firebase-auth-modal/firebase-auth-modal.component';
import * as customLocalStorage from '../../utils/local-storage';
import * as keys from '../../utils/json-keys';
import { storeInSession, getFromSession } from '../../utils/session-storage';
import { CartBadgeUpdateService } from 'src/app/shared-services/cart-badge-update-service/cart-badge-update.service';
import { DeliveryAreaDateTimeDataService } from 'src/app/shared-services/delivery-area-date-time-data/delivery-area-date-time-data.service';
import { ModalBaseComponent } from '../modal-base-component/modal-base-component.component';
import { ProductsSubsetService } from '../../api/get-products-subset/products-subset.service';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  currentDeliveryCity: string;
  currentCityCart: any = null;
  totalProducts: number = 0;
  currentUserProfile = null;

  constructor(private modalController: ModalController,
              private deliveryAreaService: DeliveryAreaDateTimeDataService,
              private cartBadgeUpdateService: CartBadgeUpdateService,
              private loadingController: LoadingController,
              private toast: ToastService,
              private productsSubsetService: ProductsSubsetService,
              private firebaseAuthModalController: ModalController,
              private angularFireAuth: AngularFireAuth) { }

  ngOnInit() {

    this.angularFireAuth.auth.onIdTokenChanged((user) => {
      this.currentCityCart = null;
      this.totalProducts = 0;
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
      }
      else{
        this.currentUserProfile = null;
      }
      // Cart component should subscribe to two services. 
      // 1. Service for delivery area change
      // 2. Service for update of cart
      
      // 1. Subscribe to delivery city change service. This is executed everytime when there is a change in delivery area
      this.deliveryAreaService.currentData.subscribe(deliveryData => {
        let deliveryCity = deliveryData.city;
        if(deliveryCity){
          this.currentDeliveryCity = deliveryCity;
          if(this.currentUserProfile){
            // Get current city cart
            let cart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
            // If cart exists get total number of products, else 0
            if(cart){
              this.currentCityCart = cart;
              // Get total number of products in cart
              this.totalProducts = this.getTotalProductsInCart();
            }
            else{
              this.totalProducts = 0;
            }
          }
          else{
            this.totalProducts = 0;
          }
        }
      });

      if(this.currentUserProfile){
        // 2. Subscribe for update of cart service
        this.cartBadgeUpdateService.currentData.subscribe(totalProducts => {
          this.totalProducts = totalProducts;
        });
      }
      else{
        this.totalProducts = 0;
      }
    });
  }

  async openCart(){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present()

      let productsId = [];

      let selectedDeliveryData = getFromSession('selectedDeliveryData');
      if(selectedDeliveryData){
        this.currentDeliveryCity = selectedDeliveryData.city;
        let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
        if(currentCityCart){
          this.currentCityCart = currentCityCart;
          productsId = this.getProductsIDInCart();
        }
      }
      // BigCommerce API has some limitations. The limitation is described as follows.
      // 1. To update the cart products with product data too is not possible because, 
      // BigCommerce "Get all products" API doesn't allow to retrieve only a set of products,
      // But variants of set of products can be retrieved. Thus we retrieve the variants data only
      // and keep the sale_price updated. Since sale_price being the important factor.
      // So because of this limitation, once the product is created the product info like,
      // Unit of Measurement, Name shouldn't be changed because it will cause discrepancy in data with
      // the product data stored in local storage for cart purpose. But the respective product data of a
      // a category in cart will be updated if the user navigates to the Category Products page.
      // For example: If the user cart has 2 products from 2 different variants,
      // Product A -> category ID = 24 & Product B -> Category ID = 25, and if the user navigates to 
      // the page with Category ID 24, the product A data in cart will be updated but not Product B data.
      if(productsId.length){
        this.productsSubsetService.getProductsSubset(productsId).subscribe((response)=>{
          this.showCart(response);
          loading.dismiss();
        },
        error => {
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
        });
      }
      else{
        this.showCart(null);
        loading.dismiss();
      }
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  showCart(response){
    let cartModal = this.modalController.create({component: ModalBaseComponent,
      componentProps: {
        response: response,
      },
      cssClass: 'cart-modal'
    })
    .then((modalElement) => {
      modalElement.present();
    });
  }

  getTotalProductsInCart(){
    // Each key corresponds to each product. Thus number of keys = number of products
    return Object.keys(this.currentCityCart[keys.line_items]).length;
  }

  // Get product ID from cart
  getProductsIDInCart(){
    let productsId = [];
    for(const [variantID, productData] of Object.entries(this.currentCityCart[keys.line_items])){
      productsId.push(productData[keys.product_id]);
    }
    return productsId;
  }

  // The prices in local storage should be updated so there is no discrepency in price.
  // updatePricesOfProductsInCart(variantsData){
  //   for(let variant of variantsData){
  //     if(variant.id in this.currentCityCart[keys.line_items]){
  //       this.currentCityCart[keys.line_items][variant.id][keys.unit_price] = variant.sale_price;
  //     }
  //   }
  //   customLocalStorage.updateCart(this.currentDeliveryCity, this.currentCityCart);
  // }
}
