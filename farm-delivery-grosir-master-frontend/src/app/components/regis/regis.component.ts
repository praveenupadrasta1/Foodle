import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { userInfo } from 'os';
import { error } from 'protractor';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { ToastService } from 'src/app/shared-services/toast-service/toast.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../api/authentication/auth.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-regis',
  templateUrl: './regis.component.html',
  styleUrls: ['./regis.component.scss'],
})
export class RegisComponent implements OnInit, AfterViewInit {

  @ViewChild(IonSlides) ionslides: IonSlides;

  public slideOpts = {
    on: {
      beforeInit() {
        const swiper = this;
        swiper.classNames.push(`${swiper.params.containerModifierClass}flip`);
        swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
        const overwriteParams = {
          slidesPerView: 1,
          slidesPerColumn: 1,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
          spaceBetween: 0,
          virtualTranslate: true,
          allowTouchMove: false
        };
        swiper.params = Object.assign(swiper.params, overwriteParams);
        swiper.originalParams = Object.assign(swiper.originalParams, overwriteParams);
      },
      setTranslate() {
        const swiper = this;
        const { $, slides, rtlTranslate: rtl } = swiper;
        for (let i = 0; i < slides.length; i += 1) {
          const $slideEl = slides.eq(i);
          let progress = $slideEl[0].progress;
          if (swiper.params.flipEffect.limitRotation) {
            progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
          }
          const offset$$1 = $slideEl[0].swiperSlideOffset;
          const rotate = -180 * progress;
          let rotateY = rotate;
          let rotateX = 0;
          let tx = -offset$$1;
          let ty = 0;
          if (!swiper.isHorizontal()) {
            ty = tx;
            tx = 0;
            rotateX = -rotateY;
            rotateY = 0;
          } else if (rtl) {
            rotateY = -rotateY;
          }

          $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

          if (swiper.params.flipEffect.slideShadows) {
            // Set shadows
            let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
            let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
            if (shadowBefore.length === 0) {
              shadowBefore = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'left' : 'top'}"></div>`);
              $slideEl.append(shadowBefore);
            }
            if (shadowAfter.length === 0) {
              shadowAfter = swiper.$(`<div class="swiper-slide-shadow-${swiper.isHorizontal() ? 'right' : 'bottom'}"></div>`);
              $slideEl.append(shadowAfter);
            }
            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
          }
          $slideEl
            .transform(`translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
        }
      },
      setTransition(duration) {
        const swiper = this;
        const { slides, activeIndex, $wrapperEl } = swiper;
        slides
          .transition(duration)
          .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
          .transition(duration);
        if (swiper.params.virtualTranslate && duration !== 0) {
          let eventTriggered = false;
          // eslint-disable-next-line
          slides.eq(activeIndex).transitionEnd(function onTransitionEnd() {
            if (eventTriggered) return;
            if (!swiper || swiper.destroyed) return;

            eventTriggered = true;
            swiper.animating = false;
            const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
            for (let i = 0; i < triggerEvents.length; i += 1) {
              $wrapperEl.trigger(triggerEvents[i]);
            }
          });
        }
      }
    }
  };

  user: Observable<firebase.User>;
  isBigScreen = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  passwordStrengthColor = "white";
  passwordStrengthBarHeight = '0px';
  passwordStrengthBarWidth = '0%';
  passwordStrength = "";

  public registerForm: FormGroup;
  public submitAttempt: boolean = false;

  get firstName(): string {
    return this.registerForm.value['firstName'];
  }
  get lastName(): string {
    return this.registerForm.value['lastName'];
  }
  get emailAddress(): string {
    return this.registerForm.value['emailAddress'];
  }
  get password(): string {
    return this.registerForm.value['password'];
  }

  registrationError = false;
  registrationErrorMessage = '';
  emailVerificationText = '';
  unsubscribe;
  isLoggedIn = false;
  isEmailVerified = false;

  constructor(private platform: Platform,
              public formBuilder: FormBuilder,
              private router: Router,
              private angularFireAuth: AngularFireAuth,
              private loadingController: LoadingController,
              private gPlus: GooglePlus,
              private toast: ToastService,
              private authService: AuthService) {

    this.user = this.angularFireAuth.authState;
    this.platform.resize.subscribe(async () => {
      if (this.platform.width() > 768) {
        this.isBigScreen = true;
      }
      else {
        this.isBigScreen = false;
      }
    });

    this.registerForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      emailAddress: ['', Validators.compose([Validators.pattern(this.emailPattern), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(15), Validators.pattern(this.mediumRegex), Validators.required])]
    });

  }
  ngAfterViewInit() {
    this.ionslides.lockSwipes(true);
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  ngOnInit() {
    this.unsubscribe = this.authService.afAuth.auth.onIdTokenChanged((res) => {
      if (res) {
        // console.log(res);
        this.isLoggedIn = true;
        // this.goHome();
      }
      else {
        this.isLoggedIn = false;
      }
    });
  }

  analyze(ev) {
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

  googleLogin() {
    this.authService.webGoogleLogin().then(userCredential => {
      if (userCredential) {
        this.isLoggedIn = true;
        userCredential.user.getIdToken().then(accessToken => {
          this.authService.createBCCustomer(accessToken).subscribe((res) => {
          });
        });
        this.goHome();
      }
    })
      .catch(error => {
      });
  }

  // googleLogin() {
  //   if (this.platform.is('cordova')) {
  //     this.nativeGoogleLogin().then(userCredential => {
  //       this.router.navigate(['/home']);
  //     })
  //       .catch(error => {
  //       });
  //   }
  //   else {
  //     this.webGoogleLogin().then(userCredential => {
  //       this.router.navigate(['/home']);
  //     })
  //       .catch(error => {

  //       });
  //   }
  // }

  // async nativeGoogleLogin(): Promise<firebase.auth.UserCredential> {
  //   try {
  //     const gPlusUser = await this.gPlus.login({
  //       'webClientId': '719564713935-7qcktprfdgvsttjikhbehoetuuul97f3.apps.googleusercontent.com',
  //       'offline': 'true',
  //       'scopes': 'profile email'
  //     });
  //     this.toast.showToast('nativeGoogleLogin', 4000, 'dark');
  //     return await this.angularFireAuth.auth.signInWithCredential(
  //       firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken)
  //     );
  //   } catch (error) {
  //     this.toast.showToast(error, 4000, 'dark');
  //   }
  // }

  // async webGoogleLogin(): Promise<firebase.auth.UserCredential> {
  //   try {
  //     const provider = new firebase.auth.GoogleAuthProvider();
  //     const credential = await this.angularFireAuth.auth.signInWithPopup(provider);
  //     return credential;
  //   } catch (error) {
  //     this.toast.showToast(error, 4000, 'dark');
  //   }
  // }

  async registerUser() {
    this.submitAttempt = true;

    if (this.registerForm.controls.firstName.valid
      && this.registerForm.controls.lastName.valid
      && this.registerForm.controls.emailAddress.valid
      && this.registerForm.controls.password.valid) {
        const loading = await this.loadingController.create({
          cssClass: 'loading',
          spinner: null
        });
        await loading.present();
      this.authService.RegisterUser(this.emailAddress, this.password).then(userCred => {
        userCred.user.updateProfile({ displayName: this.firstName + " " + this.lastName }).then(() => {
          userCred.user.getIdToken().then(accessToken => {
            this.authService.createBCCustomer(accessToken).subscribe((res) => {
            });
            // this.router.navigate(['/home']);
          });
        }).then(()=>{
          userCred.user.sendEmailVerification().then(() => {
            this.emailVerificationText = 'Email dikirim ke ' + this.emailAddress + '. Harap ikuti instruksi yang disebutkan di email.';
            this.ionslides.lockSwipes(false);
            this.ionslides.slideNext().then(() => {
              this.ionslides.lockSwipes(true);
              loading.dismiss();
            });
          }).then(()=>{
            console.log(userCred.user.emailVerified);
          });
        }).catch(error => {
          this.registrationError = true;
          this.registrationErrorMessage = 'Ada masalah dengan server, harap hubungi tim support Foodle';
          loading.dismiss();
        });
      }).catch(error => {
        this.registrationError = true;

        if (error.code == 'auth/email-already-in-use') {
          this.registrationErrorMessage = 'Alamat email ini sudah terdaftar, coba masuk dengan alamat email ini';
        } else if (error.code == 'auth/invalid-email') {
          this.registrationErrorMessage = 'Alamat email ini tidak valid, Harap masukkan alamat email yang valid';
        } else if (error.code == 'auth/operation-not-allowed') {
          this.registrationErrorMessage = 'Pendaftaran baru tidak diperbolehkan saat ini, Silakan hubungi customer support';
        } else if (error.code == 'auth/weak-password') {
          this.registrationErrorMessage = 'Password yang Anda masukkan tidak cukup kuat, coba password yang rumit';
        } else {
          this.registrationErrorMessage = 'Ada masalah dengan server, harap hubungi tim support Foodle';
        }
        loading.dismiss();
      });

    }
    else {
      this.registrationError = true;
      this.registrationErrorMessage = 'Satu atau lebih nilai yang dimasukkan tidak valid';
      return;
    }
  }

  // checkEmailVerified(): boolean{
  //   this.authService.isLoggedIn.then(user=>{
  //     if(user){
  //     console.log(user.emailVerified);
  //     }
  //   });
  //     return false;
  // }

  goHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
