import { Component, OnInit, Input, OnDestroy, HostListener, OnChanges, ChangeDetectorRef} from '@angular/core';
import { ModalController } from '@ionic/angular';

import { FirebaseAuthModalComponent } from '../firebase-auth-modal/firebase-auth-modal.component';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import * as moment from 'moment';
import * as keys from '../../utils/json-keys';
import * as customLocalStorage from '../../utils/local-storage';
import * as clone from 'clone';
import { getFromSession } from '../../utils/session-storage';
import { getCurrentDateTime } from '../../utils/date-time';
import { SearchProductGlobalService } from '../../api/search-product-global/search-product-global.service';
import { SearchBarcodeService } from '../../api/search-barcode/search-barcode.service';
import { ToastService } from '../../shared-services/toast-service/toast.service';
import { CartBadgeUpdateService } from '../../shared-services/cart-badge-update-service/cart-badge-update.service';
import { UpdateProductQuantityService } from 'src/app/shared-services/update-product-quantity/update-product-quantity.service';
import { Subscription } from 'rxjs';
import { UpdateProductDataService } from 'src/app/shared-services/update-product-data/update-product-data.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() keyword: string;
  @Input() isBarcodeSearch: number;
  @Input() doRefresh: boolean;

  products = {
                'data': [],
                'timestamp': null
            };
  generatedDateTime: any;
  currentCityProducts = [];
  currentDeliveryCity: string;
  currentCityCart: any;
  productQtyUpdateSubscription: Subscription;
  isLoading = true;
  currentUserProfile = null;
  unsubscribe: any;
  updatedQtyData = {};

  constructor(private searchProductGlobalService: SearchProductGlobalService,
            private toast: ToastService,
            private cartBadgeUpdateService: CartBadgeUpdateService,
            private updateProductQuantityService: UpdateProductQuantityService,
            private updateProductDataService: UpdateProductDataService,
            private searchBarcodeService: SearchBarcodeService,
            private firebaseAuthModalController: ModalController,
            private angularFireAuth: AngularFireAuth,
            private ref: ChangeDetectorRef) { }
  
  ngOnChanges(changes){
    if('doRefresh' in changes && 'keyword' in changes){

    }
    else{
      if('doRefresh' in changes){
        this.ngOnInit();
      }
    }
  }

  ngOnInit() {
    this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged((user) => {
      // Reset class attributes
      this.products = {
        'data': [],
        'timestamp': null
      };
      this.isLoading = true;
      this.currentCityProducts = [];
      this.currentCityCart = null;
      this.updatedQtyData = {};

      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
      }
      else{
        this.currentUserProfile = null;
      }

      this.currentDeliveryCity = getFromSession('selectedDeliveryData').city;
      if(this.currentUserProfile){
        let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
        if(currentCityCart){
          this.currentCityCart = currentCityCart;
        }
      }

      this.populateData();

      // Subscribe to update-product-quantity service. This get executed whenever the cart modal 
      // is closed along with new quantity data to update in product page.
      this.productQtyUpdateSubscription = this.updateProductQuantityService
                                              .currentData
                                              .subscribe(quantityData => {
        this.updateQuantityInCurrentCityCart(quantityData);
      });

      // Subscribe to update-product-data service. This gets called whenever the cart is opened.
      // This service helps to update the product data such as Sale Price, Inventory level.
      this.updateProductDataService.currentData.subscribe(productData => {
        this.updateProductData(productData);
      });
    });
  }

  @HostListener('window:unload')
  ngOnDestroy(){
    this.productQtyUpdateSubscription.unsubscribe();
    this.updateProductQuantityService.updateQuantity(this.updatedQtyData);
    this.unsubscribe();
  }

  populateData(){
    if(this.isBarcodeSearch){
      this.searchProductByUPCInFirestore();
    }
    else{
      this.searchProductByKeywordInBigCommerce();
    }
  }

  searchProductByUPCInFirestore(){
    // Here Keyword is UPC (Barcode).
    this.searchBarcodeService.searchProductByBarcode(this.keyword).subscribe((response) =>{
        let productsData = response['products_data'];
        // Only if products exist do this or else show 'No Products available' on the page.
        if(productsData.length){
          for(let product of productsData){
            product = this.normaliseData(product);
            this.products.data.push(product);
          }
          this.products.timestamp = response['timestamp'];
          this.filterProductsForCurrentCity(this.products.data);
          this.updateProductDataInCart();
        }
        this.isLoading = false;
        this.ref.detectChanges();
    },
    error => {
      this.isLoading = false;
      this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
    });
  }

  searchProductByKeywordInBigCommerce(){
    this.searchProductGlobalService.searchProductGlobal(this.keyword).subscribe((response) =>{
        let productsData = response['products_data'];
        // Only if products exist do this or else show 'No Products available' on the page.
        if(productsData.length){
          for(let product of productsData){
            product = this.normaliseData(product);
            this.products.data.push(product);
          }
          this.products.timestamp = response['timestamp'];
          this.filterProductsForCurrentCity(this.products.data);
          this.updateProductDataInCart();
        }
        this.isLoading = false;
        this.ref.detectChanges();
    },
    error => {
      this.isLoading = false;
      this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
    });
  }

  filterProductsForCurrentCity(products){
    this.currentCityProducts = [];
    // iterate over each product and remove other variants data leaving the current city variant data
    for(let product of products){
      let currentCityVariants = [];
      for(let variant of product.variants)
      {
        if(variant.option_values[0].label.toLowerCase() === this.currentDeliveryCity.toLowerCase()){
          currentCityVariants.push(variant);
        }
      }
      product.variants = clone(currentCityVariants);
      // The discounts are also based on cities so filter the discounts according to currentDeliveryCity
      if(product.meta_description.discount_info){
        // If the discount_info has an object with key equal to currentDeliveryCity, retrieve that data
        // else delete the discount_info object
        if(this.currentDeliveryCity in product.meta_description.discount_info){
          product.meta_description.discount_info = {
            currentDeliveryCity : product.meta_description.discount_info[this.currentDeliveryCity]
          }
        }
        else{
          delete product.meta_description.discount_info;
        }
      }
      // Add the product to the list only if the product variant for the current city exist.
      if(product.variants.length > 0){
        this.currentCityProducts.push(product);
      }
    }
  }

  normaliseData(product){

    for(let customField of product.custom_fields){
      if(customField.name === 'uom'){
        product['uom'] = customField.value;
      }
    }
    // Remove variants whose purchasing_disabled is 'true'
    let tempProduct = clone(product);
    tempProduct.variants.forEach((variant, index) => {
      if(variant.purchasing_disabled){
        product.variants.splice(index, 1);
      }
    });

    // Convert to JSON representation from string for fields specified in 'meta_description' key
    if(product.meta_description.length > 0 && this.isValidJSON(product.meta_description)){
      product.meta_description = JSON.parse(product.meta_description);

      // Remove all discounts which are before the from_date_time and after the to_date_time
      let currentDateTime = getCurrentDateTime();
      if(product.meta_description.discount_info){
        let discounts = product.meta_description.discount_info;
        for (let [city, discount] of Object.entries(discounts)) {
          let discountFromDateTime = moment(discount['from_date_time'], 'YYYY-MM-DD hh:mmA');
          let discountToDateTime= moment(discount['to_date_time'], 'YYYY-MM-DD hh:mmA');
          if(currentDateTime.isBefore(discountFromDateTime) || currentDateTime.isAfter(discountToDateTime)){
            delete product.meta_description.discount_info[city];
          }
        }
        if(Object.keys(product.meta_description.discount_info).length === 0){
          delete product.meta_description.discount_info;
        }
      }
    }
    return product;
  }

  isValidJSON(jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
  }

  updateProductDataInCart(){
    // Get the current City cart
    // let currentUserProfile = firebase.auth().currentUser;
    if(this.currentUserProfile){
      let cart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      if(cart){
        let tempCart = {};
        // Check if each product in cart actually exists in the product data recieved from server.
        // If the product in cart exist in the product data, update the product in cart with new data.
        // Else if the product in cart does not exist in the server, invalidate the product in cart.
        for(let product of this.currentCityProducts){
          let variant = product.variants[0];
          if(variant.id in cart[keys.line_items]){
            // Check the inventory level of the product recieved from server.
            // If the inventory level is < order_minimum_quantity, invalidate the product in cart.
            if(variant.inventory_level < product.order_quantity_minimum){
              delete cart[keys.line_items][variant.id];
              this.toast.showToast('Satu atau lebih produk di keranjang Anda tidak ada lagi atau kehabisan stok, jadi secara otomatis dihapus',
                                5000, 'dark');
            }
            else if(cart[keys.line_items][variant.id][keys.quantity] > variant.inventory_level){
              // If the product selected quantity level in cart is > product inventory level,
              // adjust the quantity of product automatically, 
              // compare order_qty_max and inventory_level, and update whiever is low.
              if(product.order_quantity_maximum > variant.inventory_level){
                cart[keys.line_items][variant.id][keys.quantity] = variant.inventory_level;
              }
              else{
                cart[keys.line_items][variant.id][keys.quantity] = product.order_quantity_maximum;
              }
            }

            // This check is done because in the above if statement, we are deleting the product
            // if the product inventory level is less than the minimum order quantity level.
            if(variant.id in cart[keys.line_items]){
              // Update the remaining data of the product
              cart[keys.line_items][variant.id][keys.name] = product.name;
              // cart[keys.line_items][variant.id][keys.unit_price] = variant.sale_price;
              cart[keys.line_items][variant.id][keys.uom] = product.meta_description.uom;
              cart[keys.line_items][variant.id][keys.moq] = product.order_quantity_minimum;
              cart[keys.line_items][variant.id][keys.mxoq] = product.order_quantity_maximum;
              cart[keys.line_items][variant.id][keys.inventory_level] = variant.inventory_level;
              cart[keys.line_items][variant.id][keys.img_url] = product.meta_description.image_url;

              // Copy the contents of the product to a temporary cart and delete the product in cart.
              // The logic is to pop out the product in cart which match the product in server.
              // After looping through all the products in server, if there are still any products related
              // to the same category in cart, that means the product(s) in cart doesn't exist in server. 
              // so we invalidate that product.

              tempCart[variant.id] = clone(cart[keys.line_items][variant.id]);
              delete cart[keys.line_items][variant.id];
            }
          }
        }

        // Check if there are any products left in the cart with the same categoryID.
        // If exists, invalidate the product, since it doesn't exists in server anymore.
        for(let [variantID, data] of Object.entries(clone(cart[keys.line_items]))){
          if(this.isProductExistInCategoryList(this.currentCityProducts['categories'], 
                                                                data[keys.category_id])){
            delete cart[keys.line_items][variantID];
          }
        }

        // Merge the temp list & cart data again to form new cart again.
        for(let [variantID, data] of Object.entries(tempCart)){
          cart[keys.line_items][variantID] = data;
        }

        // Update the cart in localStorage
        customLocalStorage.updateCart(this.currentUserProfile.uid, this.currentDeliveryCity, cart);
        this.cartBadgeUpdateService.updateCartBadge();
      }
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      if(currentCityCart){
        this.currentCityCart = currentCityCart;
      }
    }
  }

  updateProductData(productData){
    if(this.keyword){
      // This function updates the product data stored in session and in class attribute in which the
      // the product data is stored
      if(productData){
        for(let product of productData){
          let selectedDeliveryData = getFromSession('selectedDeliveryData');

          if(selectedDeliveryData){
            this.currentDeliveryCity = selectedDeliveryData.city;

            // updating the current city products data class attribute
            if(this.currentCityProducts){
              let index = this.getProduct(this.currentCityProducts, product[keys.product_id]);
              if(index >= 0){
                if(product[keys.variant_id] == this.currentCityProducts[index].variants[0].id){
                  this.currentCityProducts[index].name = product.name;
                  this.currentCityProducts[index].images[0].url_standard = product.img_url;
                  this.currentCityProducts[index].uom = product.uom;
                  this.currentCityProducts[index].moq = product.order_quantity_minimum;
                  this.currentCityProducts[index].mxoq = product.order_quantity_maximum;
                  this.currentCityProducts[index].variants[0].sale_price = product[keys.sale_price];
                  this.currentCityProducts[index].variants[0].inventory_level = product[keys.inventory_level];
                }
              }
            }
          }
        }
      }
    }
  }

  getProduct(products, productID){
    let productIndex = -1;
    products.forEach((product, index) => {
      if(product.id == productID){
        productIndex = index;
      }
    });
    return productIndex;
  }

  isProductExistInCategoryList(listA, listB){
    for(let idA in listA){
      for(let idB in listB){
        if(idA == idB){
          return true;
        }
      }
    }
    return false;
  }

  getSavePercentage(num1, num2){
    return Math.round(((num1-num2)/num1)*100);
  }

  // On Add button clicked
  onProductAdd(product){
    // Check if the product for the current city already in the localStorage and add product to cart
    // If doesn't exist create a new cart for the currentDeliveryCity
    // Dont forget to update the product price in local storage everytime when you get product data from BigCommerce.
    // let currentUserProfile = firebase.auth().currentUser;
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      let productData = {
        [keys.category_id]: product.categories,
        [keys.name]: product.name,
        [keys.product_id]: product.id,
        [keys.variant_id] : product.variants[0].id,
        [keys.quantity] : product.order_quantity_minimum,
        [keys.img_url]: product.images[0].url_standard,
        [keys.uom]: product.uom,
        [keys.moq]: product.order_quantity_minimum,
        [keys.mxoq]: product.order_quantity_maximum,
        [keys.inventory_level]: product.variants[0].inventory_level,
      }
      if(currentCityCart){
        let isAdded = customLocalStorage.createProductInCart(this.currentUserProfile.uid, this.currentDeliveryCity, 
                                                  product.variants[0].id, productData);
        if(isAdded){
          this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
          this.cartBadgeUpdateService.updateCartBadge();
          if(productData[keys.variant_id] in this.updatedQtyData){
            this.updatedQtyData[productData[keys.variant_id]]['quantity'] = productData[keys.quantity];
            this.updatedQtyData[productData[keys.variant_id]][keys.category_id] = productData[keys.category_id];
            this.updatedQtyData[productData[keys.variant_id]][keys.name] = product.name;
            this.updatedQtyData[productData[keys.variant_id]][keys.product_id] = product.id;
            this.updatedQtyData[productData[keys.variant_id]][keys.variant_id] = product.variants[0].id;
            this.updatedQtyData[productData[keys.variant_id]][keys.img_url] = product.images[0].url_standard;
            this.updatedQtyData[productData[keys.variant_id]][keys.uom] = product.uom;
            this.updatedQtyData[productData[keys.variant_id]][keys.moq] = product.order_quantity_minimum;
            this.updatedQtyData[productData[keys.variant_id]][keys.mxoq] = product.order_quantity_maximum;
            this.updatedQtyData[productData[keys.variant_id]][keys.inventory_level] = product.variants[0].inventory_level;
          }
          else{
            this.updatedQtyData[productData[keys.variant_id]] = {'quantity': productData[keys.quantity],
                                                                  [keys.category_id]: product.categories,
                                                                  [keys.name]: product.name,
                                                                  [keys.product_id]: product.id,
                                                                  [keys.variant_id] : product.variants[0].id,
                                                                  [keys.img_url]: product.images[0].url_standard,
                                                                  [keys.uom]: product.uom,
                                                                  [keys.moq]: product.order_quantity_minimum,
                                                                  [keys.mxoq]: product.order_quantity_maximum,
                                                                  [keys.inventory_level]: product.variants[0].inventory_level
                                                                };
          }
          this.toast.showToast('Added ' + product.name + ' to cart', 2000, 'dark');
        }
        else{
          this.toast.showToast('Couldn\'t add ' + product.name + ' the product to cart', 2000, 'dark');
        }
      }
      else{
        if(customLocalStorage.createCart(this.currentUserProfile.uid, this.currentDeliveryCity)){
          let isAdded = customLocalStorage.createProductInCart(this.currentUserProfile.uid, this.currentDeliveryCity, 
                                                  product.variants[0].id, productData);
          if(isAdded){
            this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
            this.cartBadgeUpdateService.updateCartBadge();
            if(productData[keys.variant_id] in this.updatedQtyData){
              this.updatedQtyData[productData[keys.variant_id]]['quantity'] = productData[keys.quantity];
              this.updatedQtyData[productData[keys.variant_id]][keys.category_id] = productData[keys.category_id];
              this.updatedQtyData[productData[keys.variant_id]][keys.name] = product.name;
              this.updatedQtyData[productData[keys.variant_id]][keys.product_id] = product.id;
              this.updatedQtyData[productData[keys.variant_id]][keys.variant_id] = product.variants[0].id;
              this.updatedQtyData[productData[keys.variant_id]][keys.img_url] = product.images[0].url_standard;
              this.updatedQtyData[productData[keys.variant_id]][keys.uom] = product.uom;
              this.updatedQtyData[productData[keys.variant_id]][keys.moq] = product.order_quantity_minimum;
              this.updatedQtyData[productData[keys.variant_id]][keys.mxoq] = product.order_quantity_maximum;
              this.updatedQtyData[productData[keys.variant_id]][keys.inventory_level] = product.variants[0].inventory_level;
            }
            else{
              this.updatedQtyData[productData[keys.variant_id]] = {'quantity': productData[keys.quantity],
                                                                    [keys.category_id]: product.categories,
                                                                    [keys.name]: product.name,
                                                                    [keys.product_id]: product.id,
                                                                    [keys.variant_id] : product.variants[0].id,
                                                                    [keys.img_url]: product.images[0].url_standard,
                                                                    [keys.uom]: product.uom,
                                                                    [keys.moq]: product.order_quantity_minimum,
                                                                    [keys.mxoq]: product.order_quantity_maximum,
                                                                    [keys.inventory_level]: product.variants[0].inventory_level
                                                                  };
            }
            this.toast.showToast('Added ' + product.name + ' to cart', 2000, 'dark');
          }
          else{
            this.toast.showToast('Couldn\'t add ' + product.name + ' the product to cart', 2000, 'dark');
          }
        }
        else{
          this.toast.showToast('Couldn\'t add ' + product.name + ' the product to cart', 2000, 'dark');
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

  onClickIncreaseQty(variantID, orderQtyMinimum, orderQtyMaximum, inventoryLevel){
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      let productData = customLocalStorage.getProductFromCart(currentCityCart, variantID);
      let newQty = productData[keys.quantity] + orderQtyMinimum;
      if( newQty <= inventoryLevel && newQty <= orderQtyMaximum ){
        customLocalStorage.updateProductQtyInCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID, newQty);
        this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
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

  onClickDecreaseQty(variantID, orderQtyMinimum, productName){
    if(this.currentUserProfile){
      let currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      let productData = customLocalStorage.getProductFromCart(currentCityCart, variantID);
      let newQty = productData[keys.quantity] - orderQtyMinimum;
      if( newQty >= orderQtyMinimum ){
        customLocalStorage.updateProductQtyInCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID, newQty);
        this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
        if(variantID in this.updatedQtyData){
          this.updatedQtyData[variantID]['quantity'] = newQty;
        }
        else{
          this.updatedQtyData[variantID] = {'quantity': newQty};
        }
      }
      else{
        // If the new quantity is less than order quantity minimum, remove the product from cart 
        // and hide Increase & Decrease Quantity buttons and show Add to Cart button
        if(customLocalStorage.removeProductFromCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID)){
          this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
          this.cartBadgeUpdateService.updateCartBadge();
          if(variantID in this.updatedQtyData){
            this.updatedQtyData[variantID]['quantity'] = 0;
          }
          else{
            this.updatedQtyData[variantID] = {'quantity': 0};
          }
          this.toast.showToast('Removed ' + productName + ' from cart', 2000, 'dark');

        }
      }
    }
  }

  isProductExistInCart(variantID){
    if(this.currentCityCart){
      let product = customLocalStorage.getProductFromCart(this.currentCityCart, variantID);
      if(product)
      {
        return 1;
      }
      else{
        return 0;
      }
    }
    return 0;
  }

  getProductQtyInCart(variantID){
    return this.currentCityCart[keys.line_items][variantID][keys.quantity]
  }

  updateQuantityInCurrentCityCart(quantityData){
    if(Object.keys(quantityData).length){
      this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
    }
    // if(Object.keys(quantityData).length){
    //   for(const [variantID, data] of Object.entries(quantityData)){
    //     // If the quantity is > order minimum quantity assign new qty
    //     // else remove the item from this.currentCityCart
    //     if(this.currentCityCart && keys.line_items in this.currentCityCart && 
    //       variantID in this.currentCityCart[keys.line_items]){
    //       if(data['quantity'] >= this.currentCityCart[keys.line_items][variantID]['moq']){
    //         this.currentCityCart[keys.line_items][variantID]['quantity'] = data['quantity'];
    //         if(variantID in this.updatedQtyData){
    //           this.updatedQtyData[variantID]['quantity'] = data['quantity'];
    //         }
    //         else{
    //           this.updatedQtyData[variantID] = {'quantity': data['quantity']};
    //         }
    //       }
    //       else{
    //         delete this.currentCityCart[keys.line_items][variantID];
    //         if(variantID in this.updatedQtyData){
    //           this.updatedQtyData[variantID]['quantity'] = 0;
    //         }
    //         else{
    //           this.updatedQtyData[variantID] = {'quantity': 0};
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
