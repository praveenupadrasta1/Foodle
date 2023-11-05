import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { GetOrderProductsService } from '../../api/get-order-products/get-order-products.service';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';
import { FirebaseAuthModalComponent } from '../../components/firebase-auth-modal/firebase-auth-modal.component';
import * as keys from '../../utils/json-keys';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  order: any;
  isLoading = true;
  currentUserProfile = null;
  products = {};
  appliedCoupons = [];
  isBrowser = true;

  constructor(private activatedRoute: ActivatedRoute,
              private toast: ToastService,
              private firebaseAuthModalController: ModalController,
              private getOrderProductsService: GetOrderProductsService,
              private angularFireAuth: AngularFireAuth,
              private ref: ChangeDetectorRef,
              private platform: Platform) { }

  ngOnInit() {
    this.isLoading = true;
    this.products = {};
    this.appliedCoupons = [];
    this.order = JSON.parse(decodeURIComponent(this.activatedRoute.snapshot.queryParamMap.get('a').toString()));
    this.normaliseData();
    this.angularFireAuth.auth.onIdTokenChanged((user) => {
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
        this.getOrderProductsService
        .getOrderProducts(this.currentUserProfile.stsTokenManager.accessToken, this.order.id)
        .subscribe((response) => {
          this.populateProductData(response['response']);
          this.isLoading = false;
          this.ref.detectChanges();
        },
        error => {
          this.isLoading = false;
          if(error.status == 400 || error.status == 429 || error.status == 500){
            this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          }
          else if(error.status == 403){
            this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
            this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
            .then((modalElement) => {
              modalElement.present();
            });
          }
        });
      }
      else{
        this.isLoading = false;
        this.currentUserProfile = null;
        this.toast.showToast('Silahkan masuk untuk melanjutkan!', 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
        });
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

  normaliseData(){
    this.order['staff_notes'] = JSON.parse(this.order.staff_notes);
  }

  populateProductData(lineItems){
    for(let item of lineItems){
      let variantID = item[keys.variant_id];
      if(!(variantID in this.products)){
        let data = {}
        if(!(this.isFreeItem(item))){
          data = {
            [keys.product_id]: item[keys.product_id],
            [keys.name]: item[keys.name],
            [keys.price_inc_tax]: parseInt(item[keys.price_inc_tax]),
            [keys.quantity]: item[keys.quantity],
            [keys.total_sale_price]: Math.ceil(this.getTotalSalePrice(item)),
            [keys.extended_sale_price]: parseInt(item[keys.total_inc_tax]),
            [keys.free_item]: {
              [keys.id]: "",
              [keys.free_quantity]: 0 
            }
          }
        }
        else{
          data = {
            [keys.product_id]: "",
            [keys.name]: item[keys.name],
            [keys.price_inc_tax]: parseInt(item[keys.price_inc_tax]),
            [keys.quantity]: 0,
            [keys.total_sale_price]: Math.ceil(this.getTotalSalePrice(item)),
            [keys.extended_sale_price]: item[keys.total_inc_tax],
            [keys.free_item]: {
              [keys.id]: item[keys.id],
              [keys.free_quantity]: item[keys.quantity] 
            }
          }
        }
        this.products[variantID] = data;
      }
      else{
        if(!(this.isFreeItem(item))){
          this.products[variantID][keys.product_id] = item[keys.product_id];
          this.products[variantID][keys.quantity] += item[keys.quantity];
          this.products[variantID][keys.total_sale_price] += Math.ceil(this.getTotalSalePrice(item));
          this.products[variantID][keys.extended_sale_price] += parseInt(item[keys.total_inc_tax]);
        }
        else{
          this.products[variantID][keys.free_item][keys.id] = item[keys.id];
          this.products[variantID][keys.free_item][keys.free_quantity] = item[keys.quantity];
        }
      }
    }
  }

  isFreeItem(item){
    if(item[keys.total_inc_tax] == 0){
        return item[keys.quantity];
    }
    return 0;
  }

  getTotalSalePrice(item){
    let totalDiscountedAmount = 0;
    totalDiscountedAmount = this.getTotalDiscountsApplied(item[keys.applied_discounts]);
    return item[keys.total_inc_tax] - totalDiscountedAmount;
  }

  getTotalDiscountsApplied(discounts){
    let totalDiscountedAmount = 0;
    for(let discount of discounts){
      if(discount.code == null){
        totalDiscountedAmount += parseInt(discount.amount);
      }
      else{
        this.appliedCoupons.push(discount.code);
      }
    }
    return totalDiscountedAmount;
  }

  getSubtotal(){
    let subTotal = 0;
    for(let [variantID, data] of Object.entries(this.products)){
      subTotal += data[keys.total_sale_price];
    }
    return subTotal;
  }

  getNumProducts(){
    return Object.entries(this.products).length;
  }

  refreshPage(event){
    setTimeout(() => {
      this.ngOnInit();
      // this.doRefresh = !this.doRefresh;
      event.target.complete();
    }, 2000);
  }
}
