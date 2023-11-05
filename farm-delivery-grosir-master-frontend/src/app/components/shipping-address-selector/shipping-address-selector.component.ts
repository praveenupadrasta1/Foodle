import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { FirebaseAuthModalComponent } from '../firebase-auth-modal/firebase-auth-modal.component';
import * as keys from '../../utils/json-keys';
import { UpdateShippingAddressSelectionService } from '../../shared-services/update-shipping-address-selection/update-shipping-address-selection.service';
import { DeleteShippingAddressService } from '../../api/delete-shipping-address/delete-shipping-address.service';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';
import { AddShippingAddressComponent } from '../add-shipping-address/add-shipping-address.component';
import { BroadcastNewShippingAddressService } from '../../shared-services/broadcast-new-shipping-address/broadcast-new-shipping-address.service';
import { UpdateShippingAddressComponent } from '../update-shipping-address/update-shipping-address.component';
import { BroadcastUpdatedShippingAddressService } from '../../shared-services/broadcast-updated-shipping-address/broadcast-updated-shipping-address.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-shipping-address-selector',
  templateUrl: './shipping-address-selector.component.html',
  styleUrls: ['./shipping-address-selector.component.scss'],
})
export class ShippingAddressSelectorComponent implements OnInit, OnDestroy {

  shippingAddresses = [];
  cityData: any;
  currentUserProfile = null;
  unsubscribe: any;
  isLoading = true;

  constructor(private modalController: ModalController,
              private navParams: NavParams,
              private updateShippingAddressSelectionService: UpdateShippingAddressSelectionService,
              private deleteShippingAddressService: DeleteShippingAddressService,
              private toast: ToastService,
              private loadingController: LoadingController,
              private shippingAddressModalController: ModalController,
              private updateShippingAddressModalController: ModalController,
              private broadcastNewShippingAddressService: BroadcastNewShippingAddressService,
              private broadcastUpdatedShippingAddressService: BroadcastUpdatedShippingAddressService,
              private firebaseAuthModalController: ModalController,
              private angularFireAuth: AngularFireAuth) { }

  ngOnInit() {
    this.isLoading = true;
    this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged((user) => {
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
      }
      else{
        this.currentUserProfile = null;
      }
      this.cityData = this.navParams.get('city_data');
      this.shippingAddresses = this.navParams.get('response')[keys.shipping_addresses];
      this.broadcastNewShippingAddressService.currentData.subscribe(newAddedShippingAddress => {
        if(newAddedShippingAddress && newAddedShippingAddress[keys.shipping_addresses]){
          this.addNewlyAddedShippingAddressToList(newAddedShippingAddress[keys.shipping_addresses]);
        }
      });

      this.broadcastUpdatedShippingAddressService.currentData.subscribe(updatedShippingAddress => {
        if(updatedShippingAddress && updatedShippingAddress[keys.shipping_addresses]){
          this.updateShippingAddressesInList(updatedShippingAddress[keys.shipping_addresses]);
        }
      });
      this.isLoading = false;
    });
  }

  ngOnDestroy(){
    this.unsubscribe();
  }
  // populateData(data){
  //   for(let address of data){
  //     if(address[keys.city] === this.cityData[keys.city]){
  //       this.shippingAddresses.push()
  //     }
  //   }
  // }

  closeModal(){
    this.modalController.dismiss();
  }

  getAddressLine(address){
    let address2 = address[keys.address2].split('@');
    return address[keys.address1] + ' ' + address2[0] + ', ' + address2[1];
  }

  onSelectShippingAddress(address){
    if(this.currentUserProfile){
      let address2 = address[keys.address2].split('@');
      address[keys.address2] = address2[0] + ', ' + address2[1];
      this.updateShippingAddressSelectionService.updateShippingAddress(address);
      this.closeModal();
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
        this.closeModal();
      });
    }
  }

  async deleteShippingAddress(address, index){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.deleteShippingAddressService.deleteCustomerShippingAddress(this.currentUserProfile.stsTokenManager.accessToken, {"id": address.id})
          .subscribe(response => {
            loading.dismiss();
            this.shippingAddresses.splice(index, 1);
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
        this.closeModal();
      });
    }
  }

  openAddShippingAddressModal(){
    if(this.currentUserProfile){
      this.shippingAddressModalController.create({component: AddShippingAddressComponent,
            componentProps: {
              city_data: this.cityData
            },
            cssClass: 'select-delivery-modal'
          }).then((modalElement) => {
            modalElement.present();
        });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
        this.closeModal();
      });
    }
  }

  addNewlyAddedShippingAddressToList(newAddedShippingAddress){
    for(let address of newAddedShippingAddress){
      this.shippingAddresses.push(address);
    }
  }

  openUpdateShippingAddressModal(address, index){
    if(this.currentUserProfile){
      this.updateShippingAddressModalController.create({component: UpdateShippingAddressComponent,
        componentProps: {
          city_data: this.cityData,
          shipping_address: address
        },
        cssClass: 'select-delivery-modal'
      }).then((modalElement) => {
        modalElement.present();
      });
    }
    else{
      this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
      .then((modalElement) => {
        modalElement.present();
        this.closeModal();
      });
    }
  }

  updateShippingAddressesInList(updatedShippingAddress){
    for(let address of updatedShippingAddress){
      let addressIndex = this.getShippingAddressIndex(address[keys.id]);
      if(addressIndex >= 0){
        this.shippingAddresses.splice(addressIndex, 1, address);
      }
    }
  }
  
  getShippingAddressIndex(addressID){
    let addressIndex = -1;
    this.shippingAddresses.forEach((address, index) => {
      if(address[keys.id] === addressID){
        addressIndex = index;
      }
    });
    return addressIndex;
  }
}
