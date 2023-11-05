import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { deleteCart } from '../../utils/local-storage';
import { CartBadgeUpdateService } from '../../shared-services/cart-badge-update-service/cart-badge-update.service';
import { FirebaseAuthModalComponent } from '../../components/firebase-auth-modal/firebase-auth-modal.component';
import { NavExtrasService } from '../../shared-services/nav-extras/nav-extras.service';
import { getFromSession } from '../../utils/session-storage';
import * as keys from '../../utils/json-keys';
import { ShippingAddressSelectorComponent } from '../../components/shipping-address-selector/shipping-address-selector.component';
import { GetShippingAddressesService } from '../../api/get-shipping-addresses/get-shipping-addresses.service';
import { UpdateShippingAddressSelectionService } from '../../shared-services/update-shipping-address-selection/update-shipping-address-selection.service';
import { ApplyShippingBillingAddressService } from '../../api/apply-shipping-billing-address/apply-shipping-billing-address.service';
import { ToastService } from '../../shared-services/toast-service/toast.service';
import { ApplyCouponCodeService } from '../../api/apply-coupon-code/apply-coupon-code.service';
import { DeleteCouponCodeService } from '../../api/delete-coupon-code/delete-coupon-code.service';
import { CreateInvoiceService } from '../../api/create-invoice/create-invoice.service';
import { CreateCodOrderService } from '../../api/create-cod-order/create-cod-order.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({ 
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit, AfterViewInit, OnDestroy {

  data = null;
  cartData: any;
  cityData: any;
  city: string;
  deliveryDateTime: string;
  products = {};
  disableCoupon = false;
  isShippingAddressSelected = false;
  shippingAddress: any;
  deliveryData: any;
  shippingCost: number;
  coupons = [];
  subscriberUpdatedShippingAddress: any;
  couponCodeForm: FormGroup;
  selectedPaymentMethod: string = 'COD';
  currentUserProfile = null;
  unsubscribe: any;

  constructor(private navExtrasService: NavExtrasService,
              private router: Router,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private getShippingAddressesService: GetShippingAddressesService,
              private updateShippingAddressSelectionService: UpdateShippingAddressSelectionService,
              private applyShippingBillingAddressService: ApplyShippingBillingAddressService,
              private toast: ToastService,
              public formBuilder: FormBuilder,
              private applyCouponCodeService: ApplyCouponCodeService,
              private deleteCouponCodeService: DeleteCouponCodeService,
              private createInvoiceService: CreateInvoiceService,
              private inAppBrowser: InAppBrowser,
              private createCodOrderService: CreateCodOrderService,
              private firebaseAuthModalController: ModalController,
              private cartBadgeUpdateService: CartBadgeUpdateService,
              private angularFireAuth: AngularFireAuth) {
    this.couponCodeForm = formBuilder.group({
      coupon: ['']
    });
  }

  ngOnInit() {
    this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged((user) => {
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
      }
      else{
        this.currentUserProfile = null;
      }
      this.navExtrasService.getExtras.subscribe(extras => {
        if(extras){
          this.data = extras;
        }
      });

      let selectedDeliveryData = getFromSession('selectedDeliveryData');
      if(this.data && selectedDeliveryData){
        this.cartData = this.data[keys.cart_data];
        this.cityData = this.data[keys.city_data];
        this.deliveryData = this.data[keys.delivery_data];

        this.populateDeliveryData(selectedDeliveryData);
        this.populateProductData();
        this.populateSummaryData();
        this.subscriberUpdatedShippingAddress = this.updateShippingAddressSelectionService.currentData.subscribe(updatedShippingAddress =>{
          if(updatedShippingAddress.city === this.city){
            let lineItems = this.getLineItems();
            this.shippingAddress = updatedShippingAddress;
            let shippingAddressData = this.getShippingAddress();
            let payload = {
              [keys.id]: this.cartData[keys.id],
              [keys.shipping_address]: shippingAddressData,
              [keys.line_items]: lineItems,
              [keys.city_data]: this.cityData,
              [keys.delivery_data]: this.deliveryData
            }
            this.onUpdateShippingAddress(payload);
            this.couponCodeForm.controls.coupon.enable();
          }
        });
        if(!this.isShippingAddressSelected){
          this.couponCodeForm.controls.coupon.disable();
        }
      }
      else{
        this.ngOnDestroy();
      }
    });
  }

  ngAfterViewInit(){
    this.navExtrasService.getExtras.subscribe(extras => {
      if(extras){
        this.data = extras;
      }
    });
    // document.onkeydown = function(e) {
    //   if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
    //      return false;
    //   }
    //   if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
    //      return false;
    //   }
    //   if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
    //      return false;
    //   }
    //   if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
    //      return false;
    //   }
    // }
  }

  @HostListener('window:unload')
  ngOnDestroy(){
    this.data =null;
    this.disableCoupon = false;
    this.isShippingAddressSelected = false;
    this.unsubscribe();
    // this.subscriberUpdatedShippingAddress.unsubscribe();
    this.router.navigateByUrl('home');
    // this.productCategoriesSubscription.unsubscribe();
    // this.productQtyUpdateSubscription.unsubscribe();
  }
  
  async onUpdateShippingAddress(payload){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.applyShippingBillingAddressService.applyShippingBillingAddress(this.currentUserProfile.stsTokenManager.accessToken, payload)
                                              .subscribe(response => {
        this.shippingCost = response['response'][keys.shipping_cost_total_inc_tax];
        this.isShippingAddressSelected = true;
        loading.dismiss();
      },
      error => {
        loading.dismiss();
        if(error.status == 403){
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
          });
        }
        else {
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
        }
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  populateSummaryData(){
    this.coupons = this.cartData[keys.coupons];
  }

  getLineItems(){
    let lineItems = [];
    for (let item of this.cartData[keys.line_items][keys.physical_items]){
      let itemID = item[keys.id];
      let quantity = item[keys.quantity];
      let itemData = {
        [keys.item_id]: itemID,
        [keys.quantity]: quantity
      }
      lineItems.push(itemData);
    }
    return lineItems;
  }

  getShippingAddress(){
    let shippingAddressData ={
      [keys.first_name]: this.shippingAddress[keys.first_name],
      [keys.last_name]: this.shippingAddress[keys.last_name],
      [keys.address1]: this.shippingAddress[keys.address1],
      [keys.address2]: this.shippingAddress[keys.address2],
      [keys.city]: this.shippingAddress[keys.city],
      [keys.state_or_province]: this.shippingAddress[keys.state_or_province],
      [keys.postal_code]: this.shippingAddress[keys.postal_code],
      [keys.phone]: this.shippingAddress[keys.phone],
      [keys.country_code]: this.cityData[keys.country_code]
    }
    return shippingAddressData;
  }

  populateDeliveryData(selectedDeliveryData){
    this.city = selectedDeliveryData.city;
    this.deliveryDateTime = selectedDeliveryData.dataConstructed;
  }

  populateProductData(){
    let lineItems = this.cartData[keys.line_items][keys.physical_items];
    for(let item of lineItems){
      let variantID = item[keys.variant_id];
      if(!(variantID in this.products)){
        let data = {}
        if(!(this.isFreeItem(item))){
          let isDiscounted = this.isDiscountApplied(item[keys.list_price], item[keys.sale_price]);
          data = {
            [keys.id]: item[keys.id],
            [keys.name]: item[keys.name],
            [keys.image_url]: item[keys.image_url],
            [keys.list_price]: item[keys.list_price],
            [keys.sale_price]: item[keys.sale_price],
            [keys.is_discounted]: isDiscounted,
            [keys.quantity]: item[keys.quantity],
            [keys.total_sale_price]: Math.ceil(this.getTotalSalePrice(item)),
            [keys.extended_sale_price]: item[keys.extended_sale_price],
            [keys.free_item]: {
              [keys.id]: "",
              [keys.free_quantity]: 0 
            }
          }
        }
        else{
          data = {
            [keys.id]: "",
            [keys.name]: item[keys.name],
            [keys.image_url]: item[keys.image_url],
            [keys.list_price]: item[keys.list_price],
            [keys.sale_price]: item[keys.sale_price],
            [keys.is_discounted]: false,
            [keys.quantity]: 0,
            [keys.total_sale_price]: Math.ceil(this.getTotalSalePrice(item)),
            [keys.extended_sale_price]: item[keys.extended_sale_price],
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
          let isDiscounted = this.isDiscountApplied(item[keys.list_price], item[keys.sale_price]);
          this.products[variantID][keys.id] = item[keys.id];
          this.products[variantID][keys.is_discounted] = isDiscounted;
          this.products[variantID][keys.quantity] = item[keys.quantity];
        }
        else{
          this.products[variantID][keys.free_item][keys.id] = item[keys.id];
          this.products[variantID][keys.free_item][keys.free_quantity] = item[keys.quantity];
        }
      }
    }
  }

  getTotalSalePrice(item){
    // The below "if" condition is used because, If the product has already offered at 10% discount (Product level discount), then
    // the product price that needs to be considered is which is listed in "extended_sale_price" because the "extended_sale_price" already
    // have discount applied. 
    // If the discount type is "Order Level discount", the discounts will only be mentioned in "discounts" so we need to manually calculate
    // the total_sale_price.
    // To differentiate between "Product Level Discounts" & "Order Level Discounts", its enough to check if the 
    // extended_sale_price and extended_list_price are same or not. If they both are same, we check for "discounts" key and see if any 
    // Order level discounts have been applied. If it is "Product level discounts", the extended_sale_price is taken as total_sale_price.
    let totalDiscountedAmount = 0;
    if(item[keys.extended_list_price] == item[keys.extended_sale_price]){
      totalDiscountedAmount = this.getTotalDiscountsApplied(item[keys.discounts]);
    }
    return item[keys.extended_sale_price] - totalDiscountedAmount;
  }

  getTotalDiscountsApplied(discounts){
    let totalDiscountedAmount = 0;
    for(let discount of discounts){
      totalDiscountedAmount += discount.discounted_amount;
    }
    return totalDiscountedAmount;
  }

  isDiscountApplied(listPrice, salePrice){
    if(listPrice != 0 && (listPrice - salePrice != 0)){
      this.disableCoupon = true;
      return true;
    }
    else{
      return false;
    }
  }

  isFreeItem(item){
    if(item[keys.sale_price] == 0){
        this.disableCoupon = true;
        return item[keys.quantity];
    }
    return 0;
  }

  getTotalProducts(){
    return Object.keys(this.products).length;
  }

  getTotalCouponAmount(){
    let discountedAmount = 0;
    for(let coupon of this.coupons){
      discountedAmount += coupon[keys.discounted_amount];
    }
    return discountedAmount;
  }

  getSubtotal(){
    let subTotal = 0;
    for(let [variantID, data] of Object.entries(this.products)){
      subTotal += data[keys.total_sale_price];
    }
    return subTotal;
  }

  getShippingCosts(){
    if(this.isShippingAddressSelected){
      return this.shippingCost;
    }
    else{
      return 0;
    }
  }

  getGrandTotal(){
    return this.getSubtotal() - this.getTotalCouponAmount() + this.getShippingCosts();
  }

  async openSelectShippingAddressModal(){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.getShippingAddressesService.getShippingAddresses(this.currentUserProfile.stsTokenManager.accessToken).subscribe(res => {
        loading.dismiss();
        this.modalController.create({component: ShippingAddressSelectorComponent,
          componentProps: {
            response: res,
            city_data: this.cityData
          },
          showBackdrop: true,
          cssClass: 'select-delivery-modal'
        })
        .then((modalElement) => {
            modalElement.present();
        });
      },
      error => {
        loading.dismiss();
        if(error.status === 403){
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
          });
        }
        else{
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
        }
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  async applyCouponCode(){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      let payload = await this.getApplyCouponPayload();
      this.applyCouponCodeService.applyCouponCodeToCheckout(this.currentUserProfile.stsTokenManager.accessToken, payload).subscribe(response => {
        loading.dismiss();
        this.disableCoupon = true;
        this.coupons = response['response'][keys.coupons];
      },
      error => {
        loading.dismiss();
        if(error.status === 403){
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
          });
        }
        else{
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
        }
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  getApplyCouponPayload(){
    let couponCode = this.couponCodeForm.value['coupon'];
    let payload = {
      [keys.checkout_id]: this.cartData[keys.id],
      [keys.coupon_code]: couponCode
    }
    return payload;
  }

  async deleteCoupon(couponCode, index){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      let payload = await {
        [keys.checkout_id]: this.cartData[keys.id],
        [keys.coupon_code]: couponCode
      }
      this.deleteCouponCodeService.deleteCouponCode(this.currentUserProfile.stsTokenManager.accessToken, payload).subscribe(response => {
        loading.dismiss();
        this.disableCoupon = false;
        this.coupons = response['response'][keys.coupons];
        this.toast.showToast('Voucher terhapus!', 4000, 'dark');
      },
      error => {
        loading.dismiss();
        if(error.status == 403){
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
          });
        }
        else {
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
        }
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  payAmount(){
    if(this.isShippingAddressSelected){
      if(this.selectedPaymentMethod === 'CREDIT_CARD'){
        // let grandTotal = this.getGrandTotal().toString();
        // let tokenData = {        
        //   "amount": grandTotal,        
        //   "card_number": "4000000000000002",        
        //   "card_exp_month": "12",        
        //   "card_exp_year": "2020",        
        //   "card_cvn": "123",
        //   "is_multiple_use": false,
        //   "should_authenticate": false
        // }
        // this.createToken(tokenData);
      }
      else if(this.selectedPaymentMethod === 'ONLINE'){
        let description = this.getXenInvoicePayDescription().join(', ');
        let checkoutID = this.cartData[keys.id];
        let payload = {
          [keys.payment_info]:{
            [keys.description]: '/*Delivery-info:' + this.deliveryData[keys.area] + ' ' + 
                                this.deliveryData[keys.date] + ' ' + this.deliveryData[keys.time] + '*/ - Products ' + description
          },
          [keys.checkout_id]: checkoutID,
          [keys.delivery_data]: this.deliveryData
        }
        this.createInvoice(payload);
      }
      else if(this.selectedPaymentMethod === 'OVO'){
      }
      else if(this.selectedPaymentMethod === 'COD'){
        let checkoutID = this.cartData[keys.id];
        let payload = {
          [keys.checkout_id]: checkoutID,
          [keys.delivery_data]: this.deliveryData
        }
        this.createCODOrder(payload);
      }
    }
  }

  getXenInvoicePayDescription(){
    let lineItems = this.cartData[keys.line_items][keys.physical_items];
    let descriptions = [];
    for(let item of lineItems){
      descriptions.push(item[keys.name] + ' x ' + item[keys.quantity]);
    }
    return descriptions;
  }

  async createInvoice(payload){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.createInvoiceService.createInvoice(this.currentUserProfile.stsTokenManager.accessToken, payload).subscribe(response => {
        deleteCart(this.currentUserProfile.uid, this.city);
        this.cartBadgeUpdateService.updateCartBadge();
        loading.dismiss();
        this.inAppBrowser.create(response[keys.invoice_url], '_self');
      },
      error => {
        loading.dismiss();
        if(error.status == 403){
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
          });
        }
        else {
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
        }
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  async createCODOrder(payload){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.createCodOrderService.createCodOrder(this.currentUserProfile.stsTokenManager.accessToken, payload).subscribe(response => {
        loading.dismiss();
        deleteCart(this.currentUserProfile.uid, this.city);
        this.cartBadgeUpdateService.updateCartBadge();
        this.modalController.dismiss().then(()=>{
          this.router.navigateByUrl('/order-successful?x=1&y=' + payload.checkout_id);
        });
      },
      error => {
        loading.dismiss();
        if(error.status == 403){
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
          });
        }
        else {
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
        }
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }
  
  // createToken(tokenData){
  //   Xendit.setPublishableKey(XENDIT_API_KEY);
  //   Xendit.card.createToken(tokenData, function (err, data) {
  //     if (err) {
  //         //Define error handling
  //         console.log('error creating token -> ', err);
  //     }

  //     console.log('data -> ', data);
  //     if (data.status === 'VERIFIED') {
  //         console.log('data VERIFIED  token ->', data);
  //         // Handle success
  //     } else if (data.status === 'IN_REVIEW') {
  //         // Handle authentication (3DS)
  //         let authenticationData = {
  //           'amount': tokenData['amount'],
  //           'token_id': data['id']
  //         }
  //         CheckoutPage.authentication3D(authenticationData);
  //         console.log('data IN_REVIEW create token ->', data);
  //     } else if (data.status === 'FAILED') {
  //         // Handle failure
  //         console.log('data FAILED create token ->', data);
  //     }
  //   });
  // }

  // static authentication3D(authenticationData){
  //   Xendit.card.createAuthentication(authenticationData, function (err, data) {
  //     if (err) {
  //         //Define error handling
  //         console.log('error authenticaiton -> ', err);
  //     }
  
  //     if (data.status === 'VERIFIED') {
  //         // Handle success
  //         console.log('VERIFIED response -> ', data);
  //     } else if (data.status === 'IN_REVIEW') {
  //         // Handle authentication (3DS)
  //         console.log('IN_REVIEW response -> ', data);
  //     } else if (data.status === 'FAILED') {
  //         // Handle failure
  //         console.log('FAILED response -> ', data);
  //     }
  //   });
  // }

  selectPaymentMethod(paymentMethod){
    this.selectedPaymentMethod = paymentMethod;    
  }

  getMinOrderAmountForEPayment(){
    if(this.cityData){
      return this.cityData.min_order_amt_e_payment
    }
    return 0;
  }
}
