import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private sharedToast: any;

  constructor(private toast: ToastController) { }

  showToast(message, duration, color) {
    this.sharedToast = this.toast.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top',
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
          // handler: () => {
          //   console.log('Cancel clicked');
          // }
        }
      ]
    }).then((toastData) => {
      toastData.present();
      return toastData;
    });
    return this.sharedToast;
  }
  
  hideToast() {
    this.sharedToast = this.toast.dismiss();
  }

}