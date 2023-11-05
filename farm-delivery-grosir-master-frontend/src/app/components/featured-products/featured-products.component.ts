import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Platform } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import * as clone from 'clone';
import { Subscription } from 'rxjs';
import { FirebaseAuthModalComponent } from '../firebase-auth-modal/firebase-auth-modal.component';
import { Router } from '@angular/router';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { DeliveryAreaDateTimeDataService } from '../../shared-services/delivery-area-date-time-data/delivery-area-date-time-data.service';
import { getFromSession } from '../../utils/session-storage';
import { getCurrentDateTime } from '../../utils/date-time';
import * as customLocalStorage from '../../utils/local-storage';
import * as keys from '../../utils/json-keys';
import { ToastService } from '../../shared-services/toast-service/toast.service';
import { CartBadgeUpdateService } from '../../shared-services/cart-badge-update-service/cart-badge-update.service';
import { UpdateProductQuantityService } from '../../shared-services/update-product-quantity/update-product-quantity.service';
import { UpdateProductDataService } from '../../shared-services/update-product-data/update-product-data.service';
import { UpdateFeaturedProductsService } from '../../shared-services/update-featured-products/update-featured-products.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss'],
})
export class FeaturedProductsComponent implements OnInit {
  
  @Input() doRefresh: boolean;
  
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 2.2,
    spaceBetween: 10
  };

  products = {
    'data': [],
  };
  generatedDateTime: any;
  currentCityProducts = [];
  currentCityCategories = [];
  currentDeliveryCity: string;
  currentCityCart: any;
  productQtyUpdateSubscription: Subscription;
  isLoading = true;
  currentUserProfile = null;
  unsubscribe: any;

  constructor(private platform: Platform,
            private deliveryArea: DeliveryAreaDateTimeDataService,
            private cartBadgeUpdateService: CartBadgeUpdateService,
            private toast: ToastService,
            private updateProductQuantityService: UpdateProductQuantityService,
            private updateProductDataService: UpdateProductDataService,
            private firebaseAuthModalController: ModalController,
            private router: Router,
            private updateFeaturedProductsService: UpdateFeaturedProductsService,
            private angularFireAuth: AngularFireAuth) { }
  
  ngOnChanges(){
    this.ngOnInit();
  }

  ngOnInit() {
    if(this.platform.width() >= 768){
      this.slideOpts.slidesPerView = 4.2;
    }
    else if(this.platform.width() >= 500 && this.platform.width() < 768 )
    {
      this.slideOpts.slidesPerView = 3.2;
    }
    else{
      this.slideOpts.slidesPerView = 2.2;
    }

    this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged((user) => {
      // Reset class attributes
      this.products = {
        'data': [],
      };
      this.isLoading = true;
      this.currentCityProducts = [];
      this.currentCityCart = null;

      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
      }
      else{
        this.currentUserProfile = null;
      }

      // Subscribe to update-product-quantity service. This get executed whenever the cart modal 
      // is closed along with new quantity data to update in product page.
      this.productQtyUpdateSubscription = this.updateProductQuantityService
                                              .currentData.subscribe(quantityData => {
        if(Object.keys(quantityData).length){
          this.updateQuantityInCurrentCityCart(quantityData);
        }
      });

      // Subscribe to update-product-data service. This gets called whenever the cart is opened.
      // This service helps to update the product data such as Sale Price, Inventory level.
      this.updateProductDataService.currentData.subscribe(productsData => {
        if(productsData.length){
          this.updateProductsData(productsData);
        }
      });

      this.updateFeaturedProductsService.currentData.subscribe(updatedCategoriesNProductsData => {
        if(Object.keys(updatedCategoriesNProductsData).length){
          let selectedDeliveryData = getFromSession('selectedDeliveryData');

          if(selectedDeliveryData){
            this.currentDeliveryCity = selectedDeliveryData.city;
            this.currentCityCategories = updatedCategoriesNProductsData.categories;
            this.populateData(updatedCategoriesNProductsData.featured_products);
          }
        }
      });
    });

    // Subscribe to city change event through shared service
    this.deliveryArea.currentData.subscribe(deliveryData => {
      let deliveryCity = deliveryData.city;
      if(deliveryCity){
        this.isLoading = true;
        this.currentCityProducts = [];
        this.currentCityCategories = [];
        this.currentCityCart = null;
      }
    });
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event){
  //   // console.log("Width: " + event.target.width);
  //   let width = event.target.innerWidth;
    
  //   setTimeout(() => {
  //     if(width >= 768){
  //       this.slideOpts.slidesPerView = 4.5;
  //       this.slides.update();
  //     }
  //     else if(width >= 500 && width < 768 )
  //     {
  //       this.slideOpts.slidesPerView = 3.5;
  //       this.slides.update();
  //     }
  //     else{
  //       this.slideOpts.slidesPerView = 2.2;
  //       this.slides.update();
  //     }
  //   }, 100);
  // }

  @HostListener('window:unload')
  ngOnDestroy(){
    this.productQtyUpdateSubscription.unsubscribe();
    this.unsubscribe();
  }

  populateData(featuredProducts){
    this.products.data = [];
    this.currentCityProducts = [];
    
    if(featuredProducts.length){
      for(let product of featuredProducts){
        product = this.normaliseData(product);
        this.products.data.push(product);
      }
      
      // Filter the products for current delivery city
      this.filterProductsForCurrentCity(this.products.data);
      // Update Product data in Cart based on the new product data
      this.updateProductDataInCart();
    }
    this.isLoading = false;
  }

  // Each product has variants. These variants are just based on delivery cities. 
  // So based on the current delivery city (which the user selected), filter the products
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
      // Add the product to the currentCityProducts list only if the product variant for the current city exist.
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
    if(this.currentUserProfile){
      let cart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
      if(cart){
        let tempCart = {};
        // Check if each product in cart actually exists in the product data recieved from server.
        // If the product in cart exist in the product data which is recieved from server, 
        // update the product in cart with new data.
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
              cart[keys.line_items][variant.id][keys.uom] = product.uom;
              cart[keys.line_items][variant.id][keys.moq] = product.order_quantity_minimum;
              cart[keys.line_items][variant.id][keys.mxoq] = product.order_quantity_maximum;
              cart[keys.line_items][variant.id][keys.inventory_level] = variant.inventory_level;
              cart[keys.line_items][variant.id][keys.img_url] = product.images[0].url_standard;

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
        // If exists, delete the product, since it doesn't exists in server anymore.
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

  updateProductsData(productsData){
    // This function updates the product data stored in class attribute currentCityProducts
    if(productsData){
      for(let product of productsData){
          let selectedDeliveryData = getFromSession('selectedDeliveryData');

          if(selectedDeliveryData){
            this.currentDeliveryCity = selectedDeliveryData.city;

          // updating the currentCityProducts
          if(this.currentCityProducts){
            let index = this.getProduct(this.currentCityProducts, product[keys.product_id]);
            if(index >= 0){
              if(product[keys.variant_id] == this.currentCityProducts[index].variants[0].id){
                this.currentCityProducts[index].name = product.name;
                this.currentCityProducts[index].images[0].url_standard = product.img_url;
                this.currentCityProducts[index].uom = product.uom;
                this.currentCityProducts[index].moq = product.moq;
                this.currentCityProducts[index].mxoq = product.mxoq;
                this.currentCityProducts[index].variants[0].sale_price = product[keys.sale_price];
                this.currentCityProducts[index].variants[0].inventory_level = product[keys.inventory_level];
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
    if(this.currentUserProfile){
      // this.authProvider.ui.start('#firebaseui-auth-container', FirebaseAuthProviderService.getUiConfig());
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
        [keys.inventory_level]: product.variants[0].inventory_level
      }
      if(currentCityCart){
        let isAdded = customLocalStorage.createProductInCart(this.currentUserProfile.uid, this.currentDeliveryCity, 
                                                        product.variants[0].id, productData);
        if(isAdded){
          this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
          this.cartBadgeUpdateService.updateCartBadge();
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
      }
      else{
        // If the new quantity is less than order quantity minimum, remove the product from cart 
        // and hide Increase & Decrease Quantity buttons and show Add to Cart button
        if(customLocalStorage.removeProductFromCart(this.currentUserProfile.uid, this.currentDeliveryCity, variantID)){
          this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
          this.cartBadgeUpdateService.updateCartBadge();
          this.toast.showToast('Removed ' + productName + ' from cart', 2000, 'dark');
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
    else{
      return 0;
    }
  }

  getProductQtyInCart(variantID){
    return this.currentCityCart[keys.line_items][variantID][keys.quantity]
  }

  updateQuantityInCurrentCityCart(quantityData){
    if(Object.keys(quantityData).length){
      this.currentCityCart = customLocalStorage.getCurrentCityCart(this.currentUserProfile.uid, this.currentDeliveryCity);
    }
    // if(Object.keys(quantityData).length){
    //   for(let [variantID, data] of Object.entries(quantityData)){
    //     // If the quantity is > order minimum quantity assign new qty
    //     // else remove the item from this.currentCityCart
    //     if(this.currentCityCart && keys.line_items in this.currentCityCart){
    //       if(variantID in this.currentCityCart[keys.line_items]){
    //         if(data['quantity'] >= this.currentCityCart[keys.line_items][variantID]['moq']){
    //           this.currentCityCart[keys.line_items][variantID]['quantity'] = data['quantity'];
    //         }
    //         else{
    //           delete this.currentCityCart[keys.line_items][variantID];
    //         }
    //       }
    //       else{
    //         this.currentCityCart[keys.line_items][variantID] = {
    //             'quantity': data[keys.quantity],
    //             [keys.category_id]: data[keys.category_id],
    //             [keys.name]: data[keys.name],
    //             [keys.product_id]: data[keys.product_id],
    //             [keys.variant_id] : data[keys.variant_id],
    //             [keys.img_url]: data[keys.img_url],
    //             [keys.uom]: data[keys.uom],
    //             [keys.moq]: data[keys.moq],
    //             [keys.mxoq]: data[keys.mxoq],
    //             [keys.inventory_level]: data[keys.inventory_level]
    //         }
    //       }
    //     }
    //     else{
    //       this.currentCityCart = {
    //         [keys.line_items]: {
    //           variantID: {
    //             'quantity': data[keys.quantity],
    //             [keys.category_id]: data[keys.category_id],
    //             [keys.name]: data[keys.name],
    //             [keys.product_id]: data[keys.product_id],
    //             [keys.variant_id] : data[keys.variant_id],
    //             [keys.img_url]: data[keys.img_url],
    //             [keys.uom]: data[keys.uom],
    //             [keys.moq]: data[keys.moq],
    //             [keys.mxoq]: data[keys.mxoq],
    //             [keys.inventory_level]: data[keys.inventory_level]
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }

  getFeaturedProducts(category){
    let categoryFeaturedProducts = [];
    for(let product of this.currentCityProducts){
      if(product.categories.indexOf(category.id) >= 0){
        categoryFeaturedProducts.push(product);
      }
    }
    return categoryFeaturedProducts;
  }

  goToProductPage(category){
    this.router.navigate(['/products/' + category.name + '_' + category.id]);
  }
}
