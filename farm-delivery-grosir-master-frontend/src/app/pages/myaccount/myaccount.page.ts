import { Component, OnInit, ViewChild  } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../../api/authentication/auth.service';
import { Observable, timer } from 'rxjs';
import { ToastService } from '../../shared-services/toast-service/toast.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {

  public isBigScreen = false;
  public displayName = '';
  displayNameChanged = '';
  public emailAddress = '';
  public emailVerified: boolean = null;
  public BirthDate: Date = null;
  public Gender: string = '';
  private unsubscribe;
  private authStateUnsubscribe;
  public profileType = '';
  public profileTypeId = 0;
  public editMode = false;
  public password = '';
  public confirmPassword = '';
  public oldPassword = '';
  public isInvalidPassword = false;
  public isInvalidName = false;
  public isInvalidConfirmPassword = false;
  public isSamePassword = false;
  public isReAuthenticationError = false;
  public reAuthenticationErrorMessage = '';
  public invalidPasswordText = '';
  public invalidOldPasswordText = '';
  public invalidNameText = '';
  public emailVerifiedText = '';
  public timeLeft = 60;
  public interval;
  public subscribeTimer: any;
  public verificationEmailSentNow = false;

  public passwordStrengthColor = "white";
  public passwordStrengthBarHeight = '0px';
  public passwordStrengthBarWidth = '0%';
  public passwordStrength = "";

  public strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  public mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );
  
  private user: Observable<firebase.User>;

  @ViewChild('displayInput') displayInputs: any;

  constructor(private modalController: ModalController,
              private router: Router,
              private platform: Platform,
              private toast: ToastService,
              private authService: AuthService) {

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.router.navigate(['/home']);
    });
    
    this.platform.resize.subscribe(async() => {
      if(this.platform.width() > 768){
        this.isBigScreen = true;
      }
      else
      {
        this.isBigScreen = false;
      }
    });

    this.user = this.authService.afAuth.authState;
    this.authStateUnsubscribe = this.user.subscribe(userDetails=>{
      if(userDetails){
        this.loadUserDetails(userDetails);
      }
    });
  }

  ngOnInit() {
    if(this.platform.width() > 768){
      this.isBigScreen = true;
    }
    this.unsubscribe = this.authService.afAuth.auth.onIdTokenChanged(user => {
      if(user) {
        user.reload().then(() => {
          this.loadUserDetails(user);
        }).catch(error => {
          // this.toas
        });
      }
      else {
        this.router.navigate(['/home']);
        this.displayName = 'N/A';
        this.emailAddress = 'N/A';
        this.emailVerified = false;
      }
    });
  }

  
  analyze(ev){
    var value = ev.detail.value;
    if (value == "") {
      this.passwordStrengthColor = "white";
      this.passwordStrengthBarHeight = '0px';
      this.passwordStrengthBarWidth = '0%';
      this.passwordStrength = "";
    } else if (this.strongRegex.test(value)) {
      this.passwordStrengthColor = "green";
      this.passwordStrengthBarHeight = '3px';
      this.passwordStrengthBarWidth = '80%';
      this.passwordStrength = "Good";
    } else if (this.mediumRegex.test(value)) {
      this.passwordStrengthColor = "orange";
      this.passwordStrengthBarHeight = '3px';
      this.passwordStrengthBarWidth = '50%';
      this.passwordStrength = "Medium";
    } else {
      this.passwordStrengthColor = "red";
      this.passwordStrengthBarHeight = '3px';
      this.passwordStrengthBarWidth = '20%';
      this.passwordStrength = "Weak";
    }
  }

  loadUserDetails(user: any){
    try{
        this.displayName = user.displayName;
        this.displayNameChanged = this.displayName;
        this.emailAddress = user.email;
        this.emailVerified = user.emailVerified;
        if(this.emailVerified){
          this.emailVerifiedText = 'Email terverifikasi';
        } else{
          this.emailVerifiedText = 'Email tidak diverifikasi';
        }
        this.authService.afAuth.auth.fetchSignInMethodsForEmail(this.emailAddress).then(details=>{
            this.profileType = details[0];
            if(this.profileType == 'password')
            {
              this.profileType = 'Email Masuk';
              this.profileTypeId = 1;
            }
            else if(this.profileType == 'google.com')
            {
              this.profileType = 'Gmail Masuk';
              this.profileTypeId = 2;
            }
            else{
            this.profileType = '';
            this.profileTypeId = 0;
            }
        });
      } catch(error) {
        // console.log('unable to load my accounts page');
      }
  }

  focusInput() {
    setTimeout(() => {
      this.displayInputs.setFocus();
      return 1;
    }, 100);
  }

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

  updateName(){
    let regExpArr = this.displayNameChanged.match("([a-zA-Z',.-]+( [a-zA-Z',.-]+)*){2,30}");
    regExpArr.forEach(async element => {
      if(element === this.displayNameChanged){
        this.isInvalidName = false;
          let result = await this.authService.afAuth.auth.currentUser.updateProfile({
            displayName: this.displayNameChanged
          }).then(()=> {
            this.toast.showToast('Nama Berhasil Diperbarui', 4000, 'dark');
            return true;
          }).catch(function(error){
            return false;
          });
          if(result){
            this.displayName = this.displayNameChanged;
            this.editMode = false;
            this.isInvalidName = false;
          }
          else{
            this.isInvalidName = true;
            this.invalidNameText = 'Silakan coba lagi';
            this.editMode = true;  
          }
      }
      else{
        this.isInvalidName = true;
        this.invalidNameText = 'Harap masukkan nama yang valid';
        this.editMode = true;
      }
    });
  }

  updatePassword(){
    if(this.password == this.oldPassword){
      this.isSamePassword = true;
    }
    else if(this.password == this.confirmPassword) {
      this.isSamePassword = false;
      this.isInvalidConfirmPassword = false;
      if(!this.mediumRegex.test(this.password)){
        this.isInvalidPassword = true;
      } else {
        const credential = firebase.auth.EmailAuthProvider.credential(this.emailAddress, this.oldPassword);
        this.authService.afAuth.auth.currentUser.reauthenticateWithCredential(credential).then(async UserCredential => {
          let result = await this.authService.afAuth.auth.currentUser.updatePassword(this.password).then(()=> {
            this.toast.showToast('Password Berhasil Diperbarui', 4000, 'dark');
            this.password = '';
            this.oldPassword = '';
            this.confirmPassword = '';
            return true;
          }).catch(async error =>{
            if(error.code === 'auth/requires-recent-login'){
              this.isReAuthenticationError = true;
              this.reAuthenticationErrorMessage = 'Silakan keluar dan masuk lagi dengan Password Lama untuk mengubah Password';
            }
            return false;
          });
        }).catch(error=>{
          if(error.code === 'auth/wrong-password'){
            this.isReAuthenticationError = true;
            this.reAuthenticationErrorMessage = 'Password Lama yang Anda masukkan salah, Silakan coba lagi';
          } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found'){
              this.isReAuthenticationError = true;
              this.reAuthenticationErrorMessage = 'Silakan keluar dan masuk lagi dengan Password Lama untuk mengubah Password';
          }
        });
      }
    }
    else {
      this.isSamePassword = false;
      this.isInvalidConfirmPassword = true;
    }
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


  ngOnDestroy() {
    if(this.unsubscribe){
      this.unsubscribe();
    }

    if(this.authStateUnsubscribe){
      this.authStateUnsubscribe.unsubscribe();
    }
  }
}
