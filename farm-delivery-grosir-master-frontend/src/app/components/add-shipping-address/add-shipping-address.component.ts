import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import { FirebaseAuthModalComponent } from '../firebase-auth-modal/firebase-auth-modal.component';
import { AddShippingAddressService } from '../../api/add-shipping-address/add-shipping-address.service';
import * as keys from '../../utils/json-keys';
import { BroadcastNewShippingAddressService } from '../../shared-services/broadcast-new-shipping-address/broadcast-new-shipping-address.service';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-add-shipping-address',
  templateUrl: './add-shipping-address.component.html',
  styleUrls: ['./add-shipping-address.component.scss'],
})
export class AddShippingAddressComponent implements OnInit, OnDestroy {

  public shippingAddressForm: FormGroup;
  public submitAttempt = false;

  postalCodes = [];
  areaName;
  provinceName;
  cityData: any;
  currentUserProfile = null;
  unsubscribe: any;
  selectedPostalCode: string;

  get firstName(): string {
    return this.shippingAddressForm.value['firstName'];
  }
  get lastName(): string {
    return this.shippingAddressForm.value['lastName'];
  }

  constructor(private modalController: ModalController,
              private loadingController: LoadingController,
              public formBuilder: FormBuilder,
              private addShippingAddressService: AddShippingAddressService,
              private navParams: NavParams,
              private broadcastNewShippingAddressService: BroadcastNewShippingAddressService,
              private toast: ToastService,
              private firebaseAuthModalController: ModalController,
              private angularFireAuth: AngularFireAuth) {
    this.cityData = this.navParams.get('city_data');
    this.areaName = this.cityData[keys.city];
    this.provinceName = this.cityData[keys.province];
    this.postalCodes = this.cityData[keys.pincodes];
    this.selectedPostalCode = this.postalCodes[0];

    this.shippingAddressForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      address: ['', Validators.compose([Validators.minLength(1), Validators.required])],
      phoneNum: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(13), Validators.pattern('[0-9]+') ,Validators.required])],
      postalCode: [this.selectedPostalCode, Validators.required],
      town: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      subdistrict: ['', Validators.compose([Validators.minLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      area: [{value: this.areaName, disabled: true}, Validators.compose([Validators.required])],
      province: [{value: this.provinceName, disabled: true}, Validators.compose([Validators.required])]
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
    });
  }
  
  ngOnDestroy(){
    this.unsubscribe();
  }

  closeModal(){
    this.modalController.dismiss();
  }

  onChange($event){
    this.shippingAddressForm.controls.postalCode.setValue($event.target.value);
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

  onClickAddShippingAddress(){
    this.submitAttempt = true;
    if(this.shippingAddressForm.controls.firstName.valid &&
      this.shippingAddressForm.controls.lastName.valid &&
      this.shippingAddressForm.controls.address.valid &&
      this.shippingAddressForm.controls.town.valid &&
      this.shippingAddressForm.controls.subdistrict.valid &&
      this.shippingAddressForm.controls.phoneNum.valid &&
      this.shippingAddressForm.getRawValue().area === this.areaName &&
      this.shippingAddressForm.getRawValue().province === this.provinceName &&
      this.shippingAddressForm.controls.postalCode.valid){
        let payload = this.getPayload();
        this.createShippingAddress(payload);
    }
    else{
        return;
    }
  }

  async createShippingAddress(payload){
    if(this.currentUserProfile){
      const loading = await this.loadingController.create({
        cssClass: 'loading',
        spinner: null
        // message: 'Please wait...'
      });
      await loading.present();
      this.addShippingAddressService.addShippingAddress(this.currentUserProfile.stsTokenManager.accessToken, payload).subscribe(response => {
        loading.dismiss();
        this.broadcastNewShippingAddressService.changeMessage(response);
        this.closeModal();
      },
      error => {
        loading.dismiss();
        if(error.status === 403){
          this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
          this.firebaseAuthModalController.create({component: FirebaseAuthModalComponent, cssClass: 'auth-modal'})
          .then((modalElement) => {
            this.closeModal();
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
        this.closeModal();
        modalElement.present();
      });
    }
  }

  getPayload(){
    return {
      [keys.shipping_address]: {
        [keys.first_name]: this.shippingAddressForm.value['firstName'],
        [keys.last_name]: this.shippingAddressForm.value['lastName'],
        [keys.address1]: this.shippingAddressForm.value['address'],
        [keys.address2]: this.shippingAddressForm.value['town'] + ' @ ' + this.shippingAddressForm.value['subdistrict'],
        [keys.phone]: this.shippingAddressForm.value['phoneNum'],
        [keys.city]: this.areaName,
        [keys.state_or_province]: this.provinceName,
        [keys.postal_code]: this.shippingAddressForm.value['postalCode'],
        [keys.country_code]: this.cityData[keys.country_code]
      }
    }
  }
}
