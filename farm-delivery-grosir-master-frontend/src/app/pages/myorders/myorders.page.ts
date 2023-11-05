import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { HttpUrlEncodingCodec } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

import * as keys from '../../utils/json-keys';
import { GetCustomerOrdersService } from '../../api/get-customer-orders/get-customer-orders.service';
import { ToastService } from '../../shared-services/toast-service/toast.service';
import { FirebaseAuthModalComponent } from '../../components/firebase-auth-modal/firebase-auth-modal.component';
import * as config from '../../utils/config';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit{

  currentUserProfile = null;
  customerOrders = [];
  isLoading = true;
  isBrowser = true;

  constructor(private getCustomerOrdersService: GetCustomerOrdersService,
              private toast: ToastService,
              private firebaseAuthModalController: ModalController,
              private router: Router,
              private angularFireAuth: AngularFireAuth,
              private ref: ChangeDetectorRef,
              private platform: Platform) { }

  ngOnInit() {
    this.isLoading = true;
    this.customerOrders = [];
    this.setPlatformType();
    this.angularFireAuth.auth.onIdTokenChanged((user) => {
      if(user){
        this.currentUserProfile = JSON.parse(JSON.stringify(user));
        this.getCustomerOrdersService
        .getCustomerOrders(this.currentUserProfile.stsTokenManager.accessToken)
        .subscribe((response) => {
          this.normaliseData(response['response']);
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
  }

  setPlatformType(){
    if(this.platform.is('mobileweb') || this.platform.is('desktop')){
      this.isBrowser = true;
    }
    else{
      this.isBrowser = false;
    }
  }

  normaliseData(orders){
    for(let order of orders){
      if(config.validOrderStatuses.includes(order.status_id)){
        let dateCreated = order.date_created.toString().match('[0-9]{2} [A-Za-z]{3} [0-9]{4}')[0].toString().split(' ');
        order['date_created'] = dateCreated[0];
        order['month_created'] = dateCreated[1];
        order['year_created'] = dateCreated[2];

        // Change order status to Bahasa Indonesia
        // 11 - Awaiting Fulfillment, 12 -  Manual Verification Required (used for COD orders)
        // 10 - Completed (Used for delivered)
        // 5 - Cancelled
        // 4 - Refunded, 14 - Partially refunded
        // 6 - Declined
        // 13 - Disputed
        if(order.status_id == 11 || order.status_id == 12){
          order['status'] = 'Memproses';
          order['status_color'] = 'darkorange';
        }
        else if(order.status_id == 10){
          order['status'] = 'Terkirim';
          order['status_color'] = 'darkgreen';
        }
        else if(order.status_id == 5){
          order['status'] = 'Dibatalkan';
          order['status_color'] = 'maroon';
        }
        else if(order.status_id == 4 || order.status_id == 14){
          order['status'] = 'Uang Dikembalikan';
          order['status_color'] = 'brown';
        }
        else if(order.status_id == 6){
          order['status'] = 'Ditolak';
          order['status_color'] = 'maroon';
        }
        else if(order.status_id == 13){
          order['status'] = 'Diperdebatkan';
          order['status_color'] = 'yellow';
        }
        this.customerOrders.push(order);
      }
    }
  }

  goToOrderDetailPage(order){
    let encodedData = encodeURIComponent(JSON.stringify(order))
    this.router.navigate(['/order-details'], {queryParams:{ a: encodedData }});
  }

  refreshPage(event){
    setTimeout(() => {
      this.ngOnInit();
      // this.doRefresh = !this.doRefresh;
      event.target.complete();
    }, 2000);
  }
}
