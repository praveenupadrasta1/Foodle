import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { FirebaseAuthModalComponent } from '../firebase-auth-modal/firebase-auth-modal.component';
import { UpdateShippingAddressService } from '../../api/update-shipping-address/update-shipping-address.service';
import * as keys from '../../utils/json-keys';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';
import { BroadcastUpdatedShippingAddressService } from '../../shared-services/broadcast-updated-shipping-address/broadcast-updated-shipping-address.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-update-shipping-address',
  templateUrl: './update-shipping-address.component.html',
  styleUrls: ['./update-shipping-address.component.scss'],
})
export class UpdateShippingAddressComponent implements OnInit, OnDestroy {

  public updateShippingAddressForm: FormGroup;
  public submitAttempt = false;

  postalCodes = [];
  areaName;
  provinceName;
  cityData: any;
  shippingAddress: any;
  currentUserProfile = null;
  unsubscribe: any;

  constructor(private modalController: ModalController,
              private loadingController: LoadingController,
              public formBuilder: FormBuilder,
              private updateShippingAddressService: UpdateShippingAddressService,
              private navParams: NavParams,
              private broadcastUpdatedShippingAddressService: BroadcastUpdatedShippingAddressService,
              private toast: ToastService,
              private firebaseAuthModalController: ModalController,
              private angularFireAuth: AngularFireAuth) { }

  ngOnInit() {
    this.unsubscribe = this.angularFireAuth.auth.onIdTokenChanged((user) => {
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
      }
      else{
        this.currentUserProfile = null;
      }
    });
    this.cityData = this.navParams.get('city_data');
    this.shippingAddress = this.navParams.get('shipping_address');
    this.areaName = this.cityData[keys.city];
    this.provinceName = this.cityData[keys.province];
    this.postalCodes = this.cityData[keys.pincodes];

    this.updateShippingAddressForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      address: ['', Validators.compose([Validators.minLength(1), Validators.required])],
      phoneNum: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(13), Validators.pattern('[0-9]+') ,Validators.required])],
      postalCode: ['', Validators.compose([Validators.required])],
      town: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      subdistrict: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      area: [{value: this.areaName, disabled: true}, Validators.compose([Validators.required])],
      province: [{value: this.provinceName, disabled: true}, Validators.compose([Validators.required])]
    });

    this.updateShippingAddressForm.controls.firstName.setValue(this.shippingAddress[keys.first_name]);
    this.updateShippingAddressForm.controls.lastName.setValue(this.shippingAddress[keys.last_name]);
    this.updateShippingAddressForm.controls.address.setValue(this.shippingAddress[keys.address1]);
    this.updateShippingAddressForm.controls.phoneNum.setValue(this.shippingAddress[keys.phone]);
    this.updateShippingAddressForm.controls.postalCode.setValue(this.shippingAddress[keys.postal_code]);
    let address2 = this.shippingAddress[keys.address2].split('@');
    this.updateShippingAddressForm.controls.town.setValue(address2[0]);
    this.updateShippingAddressForm.controls.subdistrict.setValue(address2[1]);
  }
  
  ngOnDestroy(){
    this.unsubscribe();
  }

  closeModal(){
    this.modalController.dismiss();
  }

  onChange($event){
    this.updateShippingAddressForm.controls.postalCode.setValue($event.target.value);
  }

  // postalCodeValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {
  //       for(let postalCode of this.postalCodes){
  //         if(control.value === postalCode){
  //           return {'posCode': true};
  //         }
  //       }
  //       return null;
  //   };
  // }

  onClickUpdateShippingAddress(){
    this.submitAttempt = true;
    if(this.updateShippingAddressForm.controls.firstName.valid &&
      this.updateShippingAddressForm.controls.lastName.valid &&
      this.updateShippingAddressForm.controls.address.valid &&
      this.updateShippingAddressForm.controls.phoneNum.valid &&
      this.updateShippingAddressForm.controls.town.valid &&
      this.updateShippingAddressForm.controls.subdistrict.valid &&
      this.updateShippingAddressForm.getRawValue().area === this.areaName &&
      this.updateShippingAddressForm.getRawValue().province === this.provinceName &&
      this.updateShippingAddressForm.controls.postalCode.valid){
        let payload = this.getPayload();
        this.updateShippingAddress(payload);
    }
    else{
        return;
    }
  }

  async updateShippingAddress(payload){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.updateShippingAddressService.updateShippingAddress(this.currentUserProfile.stsTokenManager.accessToken, payload).subscribe(response => {
        loading.dismiss();
        this.broadcastUpdatedShippingAddressService.changeMessage(response);
        this.closeModal();
      },
      error => {
        loading.dismiss();
        if(error.status === 403){
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            modalElement.present();
            this.closeModal();
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

  getPayload(){
    return {
      [keys.shipping_address]: {
        [keys.first_name]: this.updateShippingAddressForm.value['firstName'],
        [keys.last_name]: this.updateShippingAddressForm.value['lastName'],
        [keys.address1]: this.updateShippingAddressForm.value['address'],
        [keys.address2]: this.updateShippingAddressForm.value['town'] + ' @ ' + this.updateShippingAddressForm.value['subdistrict'],
        [keys.phone]: this.updateShippingAddressForm.value['phoneNum'],
        [keys.city]: this.areaName,
        [keys.state_or_province]: this.provinceName,
        [keys.postal_code]: this.updateShippingAddressForm.value['postalCode'],
        [keys.country_code]: this.cityData[keys.country_code],
        [keys.id]: this.shippingAddress[keys.id]
      }
    }
  }
}
