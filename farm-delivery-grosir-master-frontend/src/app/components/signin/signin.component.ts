import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'firebase/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../api/authentication/auth.service';
import { IonSlides } from '@ionic/angular';
import { AngularFireAnalytics } from '@angular/fire/analytics';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, AfterViewInit {

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

  private unsubscribe;
  isLoggedIn = false;
  isBigScreen = false;
  isSignInMode = true;
  passwordType: string = 'password';
  passwordLockIcon: string = 'lock-closed'; s
  passwordIcon: string = 'eye-off';
  displayFormError = false;
  errorMessage = 'Email atau Password Tidak Valid!';
  strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  mediumRegex = new RegExp(
    "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
  );

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  passwordResetEmail = '';
  passwordResetAttempted = false;
  passwordResetEmailSent = false;
  passwordResetResult = '';

  public loginForm: FormGroup;
  public submitAttempt: boolean = false;

  get emailAddress(): string {
    return this.loginForm.value['emailAddress'];
  }
  get password(): string {
    return this.loginForm.value['password'];
  }

  constructor(private platform: Platform,
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private analytics: AngularFireAnalytics) {
    this.platform.resize.subscribe(async () => {
      if (this.platform.width() > 768) {
        this.isBigScreen = true;
      }
      else {
        this.isBigScreen = false;
      }
    });

    this.loginForm = formBuilder.group({
      emailAddress: ['', Validators.compose([Validators.pattern(this.emailPattern), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(15), Validators.minLength(1), Validators.pattern(this.mediumRegex), Validators.required])]
    });

    this.loginForm = formBuilder.group({
      emailAddress: ['',Validators.compose([Validators.pattern(this.emailPattern), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(15), Validators.minLength(1), Validators.pattern(this.mediumRegex), Validators.required])]
    });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    this.passwordLockIcon = this.passwordLockIcon === 'lock-open' ? 'lock-closed' : 'lock-open';
  }

  ngOnInit() {
    this.unsubscribe = this.authService.afAuth.auth.onIdTokenChanged((res) => {
      if (res) {
        this.isLoggedIn = true;
        this.goHome();
      }
      else {
        this.isLoggedIn = false;
      }
    });
  }

  ngAfterViewInit(){
    this.ionslides.lockSwipes(true);
  }

  googleLogin() {
    this.authService.webGoogleLogin().then(userCredential => {
      if (userCredential) {
        this.isLoggedIn = true;
        this.goHome();
      }
    })
      .catch(error => {
        // console.log(error);
      });
  }

  async loginUser() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      spinner: null
      // message: 'Please wait...'
    });
    await loading.present();
    this.submitAttempt = true;
    if (this.loginForm.controls.emailAddress.valid
      && this.loginForm.controls.password.valid) {
      this.authService.SignIn(this.emailAddress, this.password).then(() => {
        this.displayFormError = false;
        this.isLoggedIn = true;
        loading.dismiss();
        this.analytics.logEvent('login', {'method':'login'} );
        this.goHome();
      })
        .catch(error => {
          let errorCode = error.code;
          this.displayFormError = true;
          if (errorCode === 'auth/wrong-password') {
            this.errorMessage = 'Password salah, Silakan coba lagi!';
          }
          else if (errorCode === 'auth/user-not-found'){
            this.errorMessage = 'Akun tidak ditemukan! Silahkan mendaftar';
          }
          else if (errorCode === 'auth/user-disabled'){
            this.errorMessage = 'Akun Anda dinonaktifkan, Silakan hubungi support';
          }
          else if (errorCode === 'auth/invalid-email'){
            this.errorMessage = 'Alamat email salah, silahkan coba lagi!';
          }
          loading.dismiss();
          return;
        });
    }
    else {
      this.errorMessage = 'Email atau Password Tidak Valid!';
      loading.dismiss();
      return;
    }
  }

  forgotPassword() {
    if (this.emailAddress.length > 0 && this.passwordResetEmail.length == 0) {
      this.passwordResetEmail = this.emailAddress;
    }
    this.ionslides.lockSwipes(false);
    this.ionslides.slideNext().then(() => {
      this.ionslides.lockSwipes(true);
    });
  }

  signInSlide() {
    this.ionslides.lockSwipes(false);
    this.ionslides.slidePrev().then(() => {
      this.ionslides.lockSwipes(true);
    });
  }

  async sendPasswordResetEmail() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      spinner: null
      // message: 'Please wait...'
    });
    await loading.present();
    // console.log(this.passwordResetEmail);
    this.authService.PasswordRecovery(this.passwordResetEmail).then(value =>{
      this.passwordResetAttempted = true;
      this.passwordResetEmailSent = true;
      this.passwordResetResult = 'Email dikirim ke ' + this.passwordResetEmail +'. Harap ikuti instruksi yang disebutkan di email.';
      // console.log(value);
      loading.dismiss();
    })
    .catch(error=>{
      this.passwordResetAttempted = true;
      this.passwordResetEmailSent = false;
      // console.log(error);
      if(error.code === 'auth/invalid-email'){
        this.passwordResetResult = 'Alamat email yang Anda berikan tidak valid, silakan periksa dan coba lagi!';
      } else if(error.code === 'auth/user-not-found'){
        this.passwordResetResult = 'Alamat Email yang Anda berikan tidak ditemukan, Periksa dan coba lagi!';
      } else  {
        this.passwordResetResult = 'Ada masalah dengan server, harap hubungi tim support Foodle';
      }
      loading.dismiss();
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    if (this.unsubscribe)
      this.unsubscribe();
  }
}
