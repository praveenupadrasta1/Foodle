import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../api/authentication/auth.service';
import { timer } from 'rxjs';
import { ToastService } from '../../shared-services/toast-service/toast.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {

  public emailVerifiedText = '';
  public emailVerified:boolean = false;
  public verificationEmailSentNow:boolean = false;
  public timeLeft = 60;
  public user;
  public authStateUnsubscribe;
  public interval;
  public subscribeTimer: any;
  public emailAddress;

  constructor(private authService: AuthService,
              private toast: ToastService,
              private modalController: ModalController) { 
    this.user = this.authService.afAuth.authState;
    this.authStateUnsubscribe = this.user.subscribe(userDetails=>{
      if(userDetails){
        this.emailVerified = userDetails.emailVerified;
        console.log(this.emailVerified);
        if(this.emailVerified){
          this.emailVerifiedText = 'Email terverifikasi';
        } else{
          this.emailVerifiedText = 'Email tidak diverifikasi';
        }
        this.emailAddress = userDetails.email;
      }
    });
  }

  ngOnInit() {}

  sendVerificationEmail(){
    this.authService.SendVerificationMail().then(success=>{
      this.verificationEmailSentNow = true;
      this.timeLeft = 60;
      this.startTimer();
      this.toast.showToast('Email dikirim ke ' + this.emailAddress + '. Harap ikuti instruksi yang disebutkan di email.', 8000, 'dark');
    }).catch(error=>{
      if(error.code){
        if(error.code == 'auth/too-many-requests'){
          this.toast.showToast('Anda telah meminta terlalu banyak email verifikasi, Harap verifikasi dengan email yang kami kirim, atau tunggu beberapa menit lagi', 4000, 'dark');
        } else{
          this.toast.showToast('Terjadi kesalahan saat mengirim email verifikasi, coba lagi', 4000, 'dark');
        }
      } else{
        this.toast.showToast('Terjadi kesalahan saat mengirim email verifikasi, coba lagi', 4000, 'dark');
      }
    });
  }

  oberserableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      console.log(val, '-');
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else{
        this.verificationEmailSentNow = false;
        this.pauseTimer();
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  ngOnDestroy(){
    this.authService.isLoggedIn.then(user =>{
      user.getIdToken(true);
    });
    if(this.authStateUnsubscribe){
      this.authStateUnsubscribe.unsubscribe();
    }
  }

  closeModal(isRefreshRequired:boolean){
    if(isRefreshRequired){
      this.authService.isLoggedIn.then(user =>{
        user.getIdToken(true);
      });
    }
    this.modalController.dismiss();
  }
}
