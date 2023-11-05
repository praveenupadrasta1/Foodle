import { Component, OnInit, AfterContentChecked, Inject } from '@angular/core';
import { ModalController, LoadingController, PopoverController, Platform } from '@ionic/angular';

import { SelectDeliveryAreaDateTimeComponent } 
            from '../../components/select-delivery-area-date-time/select-delivery-area-date-time.component';
import { AccountPopoverComponent } from '../../components/account-popover/account-popover.component';
import { GetAreasDateTimeService } from '../../api/delivery-details/get-areas-date-time.service';
import { getFromSession } from '../../utils/session-storage';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';
import * as keys from '../../utils/json-keys';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, AfterContentChecked {

  selectedDeliveryCity: string;
  selectedDeliveryDateTime: string;
  selectedDeliveryData: any = null;
  isCordova = false;
  
  constructor(private modalController: ModalController,
              private getAreas: GetAreasDateTimeService,
              public loadingController: LoadingController,
              public popoverController: PopoverController,
              private toast: ToastService,
              private router: Router,
              private platform: Platform) { }

  ngOnInit() {
    if(this.platform.is('cordova'))
    {
      this.isCordova = true;
    }
    else{
      this.isCordova = false;
    }
    this.selectedDeliveryData = this.getSessionDataFromSessionStorage();
    if(this.selectedDeliveryData == null){
      // const loading = await this.loadingController.create({
      //   message: 'Please wait...'
      // });
      // await loading.present();
      this.getAreas.getDeliveryAreasDateTime().subscribe((res) => {
                    // loading.dismiss();
        this.modalController.create({component: SelectDeliveryAreaDateTimeComponent,
                                    componentProps: {
                                      response: res
                                    },
                                    cssClass: 'select-delivery-modal'
                                  })
                            .then((modalElement) => {
                              modalElement.present();
                            });
      },
      error => {
        this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
      });
    }
  }
  
  getSessionDataFromSessionStorage(){
    return getFromSession('selectedDeliveryData');
  }

  ngAfterContentChecked(){
    this.selectedDeliveryData = this.getSessionDataFromSessionStorage();
    if(this.selectedDeliveryData != null){
      this.selectedDeliveryCity = this.selectedDeliveryData.city+', ';
      this.selectedDeliveryDateTime = this.selectedDeliveryData.dataConstructed;
    }
  }

  async openModal(){
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      spinner: null
      // message: 'Please wait...'
    });
    await loading.present();
    this.getAreas.getDeliveryAreasDateTime().subscribe((res) => {
      loading.dismiss();
      this.modalController.create({component: SelectDeliveryAreaDateTimeComponent,
                                    componentProps: {
                                      response: res
                                    },
                                    cssClass: 'select-delivery-modal'
                                  })
                          .then((modalElement) => {
                                  modalElement.present();
                                })  
    },
    error => {
      loading.dismiss();
      this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
    });
  }

  async openAccountPopover(ev) {
    const popover = await this.popoverController.create({
      component: AccountPopoverComponent,
      event: ev,
      translucent: true
    });
    return popover.present();
  }

  goToSearch(){
    this.router.navigate(['/gsearch']);
  }
}
