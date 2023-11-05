import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { FirebaseAuthModalComponent } from '../firebase-auth-modal/firebase-auth-modal.component';
import { EmailVerificationComponent } from '../email-verification/email-verification.component';
import { getFromSession } from '../../utils/session-storage';
import * as customLocalStorage from '../../utils/local-storage';
import * as keys from '../../utils/json-keys';
import * as clone from 'clone';
import { CartBadgeUpdateService } from '../../shared-services/cart-badge-update-service/cart-badge-update.service';
import { UpdateProductQuantityService } from '../../shared-services/update-product-quantity/update-product-quantity.service';
import { CreateCartService } from '../../api/create-cart/create-cart.service';
import { ToastService } from '../../shared-services/toast-service/toast.service';
import { UpdateProductDataService } from '../../shared-services/update-product-data/update-product-data.service';
import { NavExtrasService } from '../../shared-services/nav-extras/nav-extras.service';
import { SelectDeliveryAreaDateTimeComponent } 
            from '../../components/select-delivery-area-date-time/select-delivery-area-date-time.component';
import { GetAreasDateTimeService } from 'src/app/api/delivery-details/get-areas-date-time.service';
import { CheckoutPage } from '../../pages/checkout/checkout.page';
import { ProductsSubsetService } from '../../api/get-products-subset/products-subset.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../api/authentication/auth.service';

@Component({
  selector: 'app-cart-products-list',
  templateUrl: './cart-products-list.component.html',
  styleUrls: ['./cart-products-list.component.scss'],
})
export class CartProductsListComponent implements OnInit, OnDestroy {

  currentDeliveryCity: string;
  currentCityCartProducts = [];
  updatedQtyData: any = {};
  currentUserProfile = null;
  unsubscribe: any;
  isLoading = true;
  isEmailVerified = false;

  constructor(private modalController: ModalController,
              private navParams: NavParams,
              private cartBadgeUpdateService: CartBadgeUpdateService,
              private updateProductQuantityService: UpdateProductQuantityService,
              private createCartService: CreateCartService,
              private toast: ToastService,
              private updateProductDataService: UpdateProductDataService,
              private loadingController: LoadingController,
              private router: Router,
              private authService: AuthService,
              private navExtrasService: NavExtrasService,
              private deliveryAreaSelectModalController: ModalController,
              private getAreas: GetAreasDateTimeService,
              private productsSubsetService: ProductsSubsetService,
              private firebaseAuthModalController: ModalController,
              private emailVerificationModalController: ModalController,
              private angularFireAuth: AngularFireAuth) { }
  
  ngOnInit() {
    this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged((user) => {
      this.currentCityCartProducts = [];
      this.updatedQtyData = {};
      this.isLoading = false;
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
        this.isEmailVerified = user.emailVerified;
      }
      else{
        this.currentUserProfile = null;
      }

      let productsData = this.navParams.get('products_data');
      if(productsData){
        // variantsData = variantsData.variants_data;
        let selectedDeliveryData = getFromSession('selectedDeliveryData');
        if(selectedDeliveryData){
          this.currentDeliveryCity = selectedDeliveryData.city;
          if(this.currentUserProfile){
            let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
            if(currentCityCart){
              this.mapCurrentCityCartAndProductsData(currentCityCart, productsData);
              this.updateProductDataService.updateProductData(clone(this.currentCityCartProducts));
              // Everytime new product data is received from server, so update the local storage cart
              // with the new data. The new product data includes sale_price and inventory_level
              this.updateLocalStorageCartWithNewProductData(currentCityCart, productsData);
            }
          }
          else{
            this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
            .then((modalElement) => {
              modalElement.present();
            });
          }
        }
      }
    });
  }

  // The product data from server should be merged with the currentCityCart data
  mapCurrentCityCartAndProductsData(currentCityCart, productsData){
    for(let product of productsData){
      let variantsData = product.variants;
      for(let variant of variantsData){
        if(variant.id in currentCityCart[keys.line_items]){
          currentCityCart[keys.line_items][variant.id][keys.category_id] = product.categories;
          currentCityCart[keys.line_items][variant.id][keys.name] = product.name;
          currentCityCart[keys.line_items][variant.id][keys.img_url] = product.images[0].url_standard;
          for(let customField of product.custom_fields){
            if(customField.name === 'uom'){
              currentCityCart[keys.line_items][variant.id][keys.uom] = customField.value;
            }
          }
          currentCityCart[keys.line_items][variant.id][keys.moq] = product.order_quantity_minimum;
          currentCityCart[keys.line_items][variant.id][keys.mxoq] = product.order_quantity_maximum;
          currentCityCart[keys.line_items][variant.id][keys.sale_price] = variant.sale_price;
          currentCityCart[keys.line_items][variant.id][keys.inventory_level] = variant.inventory_level;
          this.currentCityCartProducts.push(currentCityCart[keys.line_items][variant.id]);
        }
      }
    }
  }

  updateLocalStorageCartWithNewProductData(currentCityCart, productsData){
    if(this.currentUserProfile){
      let variantIDs = [];
      let variantsData = [];
      for(let product of productsData){
        // Get variant IDs from variantsData. This VariantsData is from Server.
        for(let variant of product.variants){
          variantIDs.push(variant.id);
          variantsData.push(variant);
        }
      }
      for(let variantID of Object.keys(currentCityCart[keys.line_items])){

        let index = variantIDs.indexOf(parseInt(variantID));

        // If the variantID in Local Storage cart exists in the VariantIDs List, it means the variant in the 
        // local storage cart is valid. This is checked using the condition 'index >= 0'
        // Also checking another condition whether the purchasing is disabled for that variant or not
        if(index >= 0 && variantsData[index].purchasing_disabled == false){

          currentCityCart[keys.line_items][variantID][keys.inventory_level] = variantsData[index].inventory_level;

          if(variantsData[index].inventory_level < currentCityCart[keys.line_items][variantID][keys.moq]){
            let variant_index = this.getVariantIndexFromCart(variantID);
            if(variant_index >= 0){
              delete currentCityCart[keys.line_items][variantID];
              this.removeProductFromCart(variantID, variant_index);
              this.toast.showToast('Satu atau lebih produk di keranjang Anda tidak ada lagi atau kehabisan stok, jadi secara otomatis dihapus',
                                  5000, 'dark');
            }
          }
          else if(currentCityCart[keys.line_items][variantID][keys.quantity] > variantsData[index].inventory_level){
            // If the product selected quantity level in cart is > product inventory level,
            // adjust the quantity of product automatically, 
            // compare order_qty_max and inventory_level, and update whiever is low.
            if(currentCityCart[keys.line_items][variantID][keys.mxoq] > variantsData[index].inventory_level){
              currentCityCart[keys.line_items][variantID][keys.quantity] = variantsData[index].inventory_level;
            }
            else{
              currentCityCart[keys.line_items][variantID][keys.quantity] = currentCityCart[keys.line_items][variantID][keys.mxoq];
            }
            let data = this.getProductData(variantsData[index].product_id, productsData);
            if(data){
              currentCityCart[keys.line_items][variantID][keys.category_id] = data.categories;
              currentCityCart[keys.line_items][variantID][keys.name] = data.name;
              currentCityCart[keys.line_items][variantID][keys.img_url] = data.images[0].url_standard;
              for(let customField of data.custom_fields){
                if(customField.name === 'uom'){
                  currentCityCart[keys.line_items][variantID][keys.uom] = customField.value;
                }
              }
              currentCityCart[keys.line_items][variantID][keys.moq] = data.order_quantity_minimum;
              currentCityCart[keys.line_items][variantID][keys.mxoq] = data.order_quantity_maximum;
              currentCityCart[keys.line_items][variantID][keys.sale_price] = variantsData[index].sale_price;
            }
          }
          else if(currentCityCart[keys.line_items][variantID][keys.quantity] <= variantsData[index].inventory_level
                  && currentCityCart[keys.line_items][variantID][keys.quantity] >= 0){

            let data = this.getProductData(variantsData[index].product_id, productsData);
            if(data){
              currentCityCart[keys.line_items][variantID][keys.category_id] = data.categories;
              currentCityCart[keys.line_items][variantID][keys.name] = data.name;
              currentCityCart[keys.line_items][variantID][keys.img_url] = data.images[0].url_standard;
              for(let customField of data.custom_fields){
                if(customField.name === 'uom'){
                  currentCityCart[keys.line_items][variantID][keys.uom] = customField.value;
                }
              }
              currentCityCart[keys.line_items][variantID][keys.moq] = data.order_quantity_minimum;
              currentCityCart[keys.line_items][variantID][keys.mxoq] = data.order_quantity_maximum;
              currentCityCart[keys.line_items][variantID][keys.sale_price] = variantsData[index].sale_price;
            }
          }
          if(variantID in currentCityCart[keys.line_items]){
            if(variantID in this.updatedQtyData){
              this.updatedQtyData[variantID]['quantity'] = currentCityCart[keys.line_items][variantID][keys.quantity];
            }
            else{
              this.updatedQtyData[variantID] = {'quantity': currentCityCart[keys.line_items][variantID][keys.quantity]};
            }
          }
        }
        else{
          let variant_index = this.getVariantIndexFromCart(variantID);
          if(variant_index >= 0){
            delete currentCityCart[keys.line_items][variantID];
            this.removeProductFromCart(variantID, variant_index);
            this.toast.showToast('Satu atau lebih produk di keranjang Anda tidak ada lagi atau kehabisan stok, jadi secara otomatis dihapus',
            5000, 'dark');
          }
        }
      }
      customLocalStorage.updateCart(this.currentUserProfile.uid, this.currentDeliveryCity, currentCityCart);
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  adjustQuantityOfProductsInLocalStorageCart(currentCityCart, product){
    if(this.currentUserProfile){
      let variant = product.variants[0];
      // Loop through each variant and update the product info
      currentCityCart[keys.line_items][variant.id][keys.inventory_level] = variant.inventory_level;

      if(variant.inventory_level < currentCityCart[keys.line_items][variant.id][keys.moq]){
        let variant_index = this.getVariantIndexFromCart(variant.id);
        if(variant_index >= 0){
          delete currentCityCart[keys.line_items][variant.id];
          this.removeProductFromCart(variant.id, variant_index);
          this.toast.showToast('Satu atau lebih produk di keranjang Anda tidak ada lagi atau kehabisan stok, jadi secara otomatis dihapus',
                              5000, 'dark');
        }
      }
      else if(currentCityCart[keys.line_items][variant.id][keys.quantity] > variant.inventory_level){
        // If the product selected quantity level in cart is > product inventory level,
        // adjust the quantity of product automatically, 
        // compare order_qty_max and inventory_level, and update whiever is low.
        if(currentCityCart[keys.line_items][variant.id][keys.mxoq] > variant.inventory_level){
          currentCityCart[keys.line_items][variant.id][keys.quantity] = variant.inventory_level;
        }
        else{
          currentCityCart[keys.line_items][variant.id][keys.quantity] = currentCityCart[keys.line_items][variant.id][keys.mxoq];
        }
        currentCityCart[keys.line_items][variant.id][keys.category_id] = product.categories;
        currentCityCart[keys.line_items][variant.id][keys.name] = product.name;
        currentCityCart[keys.line_items][variant.id][keys.img_url] = product.images[0].url_standard;
        for(let customField of product.custom_fields){
          if(customField.name === 'uom'){
            currentCityCart[keys.line_items][variant.id][keys.uom] = customField.value;
          }
        }
        currentCityCart[keys.line_items][variant.id][keys.moq] = product.order_quantity_minimum;
        currentCityCart[keys.line_items][variant.id][keys.mxoq] = product.order_quantity_maximum;
        currentCityCart[keys.line_items][variant.id][keys.sale_price] = variant.sale_price;
      }
      else if(currentCityCart[keys.line_items][variant.id][keys.quantity] <= variant.inventory_level
              && currentCityCart[keys.line_items][variant.id][keys.quantity] >= 0){

        currentCityCart[keys.line_items][variant.id][keys.category_id] = product.categories;
        currentCityCart[keys.line_items][variant.id][keys.name] = product.name;
        currentCityCart[keys.line_items][variant.id][keys.img_url] = product.images[0].url_standard;
        for(let customField of product.custom_fields){
          if(customField.name === 'uom'){
            currentCityCart[keys.line_items][variant.id][keys.uom] = customField.value;
          }
        }
        currentCityCart[keys.line_items][variant.id][keys.moq] = product.order_quantity_minimum;
        currentCityCart[keys.line_items][variant.id][keys.mxoq] = product.order_quantity_maximum;
        currentCityCart[keys.line_items][variant.id][keys.sale_price] = variant.sale_price;
      }
      if(variant.id in currentCityCart[keys.line_items]){
        if(variant.id in this.updatedQtyData){
          this.updatedQtyData[variant.id]['quantity'] = currentCityCart[keys.line_items][variant.id][keys.quantity];
        }
        else{
          this.updatedQtyData[variant.id] = {'quantity': currentCityCart[keys.line_items][variant.id][keys.quantity]};
        }
      }
      customLocalStorage.updateCart(this.currentUserProfile.uid, this.currentDeliveryCity, currentCityCart);
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  getProductData(productID, productsData){
    for(let product of productsData){
      if(product.id === productID){
        return product;
      }
    }
    return null;
  }

  getProductTotalPrice(salePrice, quantity){
    return salePrice * quantity;
  }

  ngOnDestroy(){
    if(Object.keys(this.updatedQtyData).length){
      this.updateProductQuantityService.updateQuantity(this.updatedQtyData);
    }
    this.unsubscribe();
  }

  closeCart(){
    this.modalController.dismiss();
  }

  getSubtotal(){
    let total = 0;
    for(let product of this.currentCityCartProducts){
      total += this.getProductTotalPrice(product.sale_price, product.quantity);
    }
    return total;
  }

  onClickIncreaseQty(variantID, orderQtyMinimum, orderQtyMaximum, inventoryLevel, index){
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      let productData = customLocalStorage.getProductFromCart(currentCityCart, variantID);
      let newQty = productData[keys.quantity] + orderQtyMinimum;
      if( newQty <= inventoryLevel && newQty <= orderQtyMaximum ){
        customLocalStorage.updateProductQtyInCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID, newQty);
        this.currentCityCartProducts[index][keys.quantity] = newQty;
        if(variantID in this.updatedQtyData){
          this.updatedQtyData[variantID]['quantity'] = newQty;
        }
        else{
          this.updatedQtyData[variantID] = {'quantity': newQty};
        }
      }
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  onClickDecreaseQty(variantID, orderQtyMinimum, index){
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      let productData = customLocalStorage.getProductFromCart(currentCityCart, variantID);
      let newQty = productData[keys.quantity] - orderQtyMinimum;
      if( newQty >= orderQtyMinimum ){
        customLocalStorage.updateProductQtyInCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID, newQty);
        this.currentCityCartProducts[index][keys.quantity] = newQty;
        if(variantID in this.updatedQtyData){
          this.updatedQtyData[variantID]['quantity'] = newQty;
        }
        else{
          this.updatedQtyData[variantID] = {'quantity': newQty};
        }
      }
      else{
        // If the new quantity is less than order quantity minimum, remove the product from cart
        if(customLocalStorage.removeProductFromCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID)){
          this.currentCityCartProducts.splice(index, 1);
          this.cartBadgeUpdateService.updateCartBadge();
          if(variantID in this.updatedQtyData){
            this.updatedQtyData[variantID]['quantity'] = newQty;
          }
          else{
            this.updatedQtyData[variantID] = {'quantity': newQty};
          }
        }
      }
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  removeProductFromCart(variantID, index){
    if(this.currentUserProfile){
      if(customLocalStorage.removeProductFromCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID)){
        this.currentCityCartProducts.splice(index, 1);
        this.cartBadgeUpdateService.updateCartBadge();
        if(variantID in this.updatedQtyData){
          this.updatedQtyData[variantID]['quantity'] = 0;
        }
        else{
          this.updatedQtyData[variantID] = {'quantity': 0};
        }
      }
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  updateCurrentCityCartProducts(index, variantsData){
    for(let variant of variantsData){
      if(variant.id == this.currentCityCartProducts[index][keys.variant_id])
      {
        this.currentCityCartProducts[index][keys.sale_price] = variant.sale_price;
        this.currentCityCartProducts[index][keys.inventory_level] = variant.inventory_level;
        if(this.currentCityCartProducts[index][keys.quantity] > variant.inventory_level){
          // If the product selected quantity level in cart is > product inventory level,
          // adjust the quantity of product automatically, 
          // compare order_qty_max and inventory_level, and update whiever is low.
          if(this.currentCityCartProducts[index][keys.mxoq]>  variant.inventory_level){
            this.currentCityCartProducts[index][keys.quantity] = variant.inventory_level;
          }
          else{
            this.currentCityCartProducts[index][keys.quantity] = this.currentCityCartProducts[index][keys.mxoq];
          }
        }
      }
    }
  }

  getLineItems(){
    let lineItems = [];
    for(let product of this.currentCityCartProducts){
      let productData = {};
      productData[keys.product_id] = product[keys.product_id];
      productData[keys.variant_id] = product[keys.variant_id];
      productData[keys.quantity] = product[keys.quantity];
      lineItems.push(productData);
    }
    return lineItems;
  }

  async createCart(){
    if(this.currentUserProfile){
      await this.authService.isLoggedIn.then(user =>{
        user.reload().then(async () => {
          if(user.emailVerified){
            const loading = await this.loadingController.create({
              cssClass: 'loading',
              spinner: null
            });
            await loading.present();
            await this.createCartService.createCart(this.currentUserProfile.stsTokenManager.accessToken, this.getLineItems(), this.getDeliveryData()).subscribe(response => {
              loading.dismiss();
              // console.log('createCart Response -> ', response);
              this.navExtrasService.setExtras(response);
              const nav = document.querySelector('ion-nav');
              nav.push(CheckoutPage);
            },
            error => {
              loading.dismiss();
              // If error status is 422, it means, one or more products in the cart has insufficient inventory level.
              // As of now, Bigcommerce cannot list all the products which have insufficient inventory levels.
              // For example: If there are 3 Products in our cart and out of 3 products, if for 2 products the 
              // inventory level is insufficient, bigcommerce will only mention 1 product has insufficient inventory level.
              // So to update the inventory level of the second product too, then a second request for create cart needs to be sent.
              if(error.status == 422){
                // Get the product ID (only 1 product ID will be mentioned even if there are more than 1 product with insufficient 
                // inventory levels) from error string, using regex.
                let productIDs = error[keys.error][keys.error].match(/\d+/g);
                // For loop is used just in case, if BigCommerce makes a change to their API which can respond with list of products
                // with insufficient inventory levels.
                for(let productID of productIDs){
                  let index = this.getProductIndexFromProductIDInCart(productID);
                  if(index >= 0){
                    let product = this.currentCityCartProducts[index];
                    this.getProductsDataFromAPIAndUpdateCart(productID, index);
                  }
                }
              }
              else if(error.status == 400){
                let errorCode = this.getErrorCode(error[keys.error]);
                this.doActionBasedOnErrorCode(error[keys.error], errorCode);
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
            this.emailVerificationModalController.create({component:EmailVerificationComponent, cssClass: 'sm-modal'})
            .then((modalElement)  =>  {
              modalElement.present();
            });
            // this.toast.showToast('Email Anda belum diverifikasi. Harap verifikasi email Anda untuk melanjutkan proses checkout.', 7000, 'danger');
          }
        }).catch(error => {
          this.toast.showToast('Terjadi masalah. Silakan coba lagi setelah beberapa saat!', 4000, 'dark');
        });
      }).catch(error => {
        this.toast.showToast('Terjadi masalah. Silakan coba lagi setelah beberapa saat!', 4000, 'dark');
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  getErrorCode(error){
    return error[keys.error_code].toString().split('_')[0];
  }

  doActionBasedOnErrorCode(error, errorCode){
    if(errorCode === '000'){
      this.openSelectDeliveryDataModal();
      this.toast.showToast(error[keys.error], 4000, 'dark');
      this.closeCart();
    }
    else if(errorCode === '001'){
      this.adjustQuantityOfLowStockItemsInCart(error[keys.items_low_stock]);
      this.removeBadDataItemsInCart(error[keys.items_bad_data]);
      this.toast.showToast(error[keys.error], 4000, 'dark');
      this.closeCart();
    }
    else if(errorCode === '002'){
      this.adjustQuantityOfLowStockItemsInCart(error[keys.items_low_stock]);
      this.toast.showToast(error[keys.error], 4000, 'dark');
    }
    else if(errorCode === '003'){
      this.removeBadDataItemsInCart(error[keys.items_bad_data]);
      this.toast.showToast(error[keys.error], 4000, 'dark');
      this.closeCart();
    }
    else if(errorCode === '006'){
      this.toast.showToast('Server sedang sibuk. Silakan coba setelah beberapa saat', 4000, 'dark');
    }
    else if(errorCode === '007'){
      this.removeBadVariantItemsInCart(error[keys.items_bad_variants]);
      this.toast.showToast(error[keys.error], 4000, 'dark');
    }
    else if(errorCode === '008'){
      this.adjustQuantityOfLowStockItemsInCart(error[keys.items_low_stock]);
      this.removeBadDataItemsInCart(error[keys.items_bad_data]);
      this.removeBadVariantItemsInCart(error[keys.items_bad_variants]);
      this.toast.showToast(error[keys.error], 4000, 'dark');
      this.closeCart();
    }
    else if(errorCode === '009'){
      this.removeBadDataItemsInCart(error[keys.items_bad_data]);
      this.removeBadVariantItemsInCart(error[keys.items_bad_variants]);
      this.toast.showToast(error[keys.error], 4000, 'dark');
      this.closeCart();
    }
    else if(errorCode === '010'){
      this.adjustQuantityOfLowStockItemsInCart(error[keys.items_low_stock]);
      this.removeBadVariantItemsInCart(error[keys.items_bad_variants]);
      this.toast.showToast(error[keys.error], 4000, 'dark');
      this.closeCart();
    }
    else if(errorCode === '011'){
      this.toast.showToast('Silahkan masuk untuk melanjutkan!', 5000, 'dark');
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  removeBadVariantItemsInCart(itemsBadVariants){
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      if(currentCityCart && keys.line_items in currentCityCart){
        for(let item of itemsBadVariants){
          if(item[keys.variant_id] in currentCityCart[keys.line_items]){
            let variantIndex = this.getVariantIndexFromCart(item[keys.variant_id]);
            this.removeProductFromCart(item[keys.variant_id], variantIndex);
          }
        }
      }
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  removeBadDataItemsInCart(itemsBadData){
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      if(currentCityCart && keys.line_items in currentCityCart){
        for(let item of itemsBadData){
          if(item.variants[0].id in currentCityCart[keys.line_items]){
            let variantIndex = this.getVariantIndexFromCart(item.variants[0].id);
            this.removeProductFromCart(item.variants[0].id, variantIndex);
          }
        }
      }
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  adjustQuantityOfLowStockItemsInCart(itemsLowStock){
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      if(currentCityCart && keys.line_items in currentCityCart){
        for(let item of itemsLowStock){
          // There will be only one variant in the product data returned. So its possible to directly query it as variants[0].
          if(item.variants[0].id in currentCityCart[keys.line_items]){
            let variantIndex = this.getVariantIndexFromCart(item.variants[0].id);
            this.updateCurrentCityCartProducts(variantIndex, item.variants);
            // Fire this event since the current city cart products are updated with new data.
            this.updateProductDataService.updateProductData(clone(this.currentCityCartProducts));
            // Everytime new product data is received from server, so update the local storage cart
            // with the new data.
            this.adjustQuantityOfProductsInLocalStorageCart(currentCityCart, item);
          }
        }
      }
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  async openSelectDeliveryDataModal(){
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      spinner: null
      // message: 'Please wait...'
    });
    await loading.present();
    this.getAreas.getDeliveryAreasDateTime().subscribe((res) => {
      loading.dismiss();
      this.deliveryAreaSelectModalController
          .create({component: SelectDeliveryAreaDateTimeComponent,
                    componentProps: {
                      response: res
                    },
                    cssClass: 'select-delivery-modal'
                  })
          .then((modalElement) => {
            modalElement.present();
            this.closeCart();
          });
    },
    error => {
      this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
    });
  }

  async getProductsDataFromAPIAndUpdateCart(productID, index){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.productsSubsetService.getProductsSubset([productID]).subscribe((response)=>{
        loading.dismiss();
        let productsData = response['products_data'];
        let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
        if(currentCityCart){
          this.updateCartData(index, productsData, currentCityCart);
        }
      },
      error => {
        loading.dismiss();
        this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
      });
    }
  }

  updateCartData(index, productsData, currentCityCart){
    let variantsData = [];
    for(let product of productsData){
      for(let variant of product.variants){
        variantsData.push(variant);
      }
    }
    this.updateCurrentCityCartProducts(index, variantsData);
    // Fire this event since the current city cart products are updated with new data.
    this.updateProductDataService.updateProductData(clone(this.currentCityCartProducts));
    // Everytime new product data is received from server, so update the local storage cart
    // with the new data.
    this.updateLocalStorageCartWithNewProductData(currentCityCart, productsData);
  }
    
  getProductIndexFromProductIDInCart(productID){
    let productIndex = -1;
    this.currentCityCartProducts.forEach((product, index) =>{
      if(productID == product.product_id){
        productIndex = index;
      }
    });
    return productIndex;
  }

  getVariantIndexFromCart(variantID){
    let productIndex = -1;
    this.currentCityCartProducts.forEach((product, index) =>{
      if(variantID == product.variant_id){
        productIndex = index;
      }
    });
    return productIndex;
  }

  getDeliveryData(){
    let selectedDeliveryData = getFromSession('selectedDeliveryData');
    return {
      [keys.area]: selectedDeliveryData.city,
      [keys.date]: selectedDeliveryData.deliveryDate,
      [keys.time]: selectedDeliveryData.deliveryTime
    }
  }
}
