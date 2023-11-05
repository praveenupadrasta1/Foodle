import { Component, OnInit } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import 'firebase/auth';
import { ToastService } from '../../shared-services/toast-service/toast.service';
import { AuthService } from '../../api/authentication/auth.service';


@Component({
  selector: 'app-account-popover',
  templateUrl: './account-popover.component.html',
  styleUrls: ['./account-popover.component.scss'],
})
export class AccountPopoverComponent implements OnInit {

  private unsubscribe;
  public isUserAuthenticated:boolean = false;
  constructor(private popoverController: PopoverController,
              private router: Router,
              private toast: ToastService,
              private authService: AuthService) {
              }

  closeAccountPopover()
  {
    this.popoverController.dismiss();
  }

  openMyAccountPage()
  {
    this.closeAccountPopover();
    this.router.navigate(['/account/myaccount']);
  }

  openMyOrdersPage()
  {
    this.closeAccountPopover();
    this.router.navigate(['/account/myorders']);
  }

  ngOnInit() {
    this.unsubscribe = this.authService.afAuth.auth.onIdTokenChanged((res) => {
      if (res) {
        this.isUserAuthenticated = true;
      }
      else{
        this.isUserAuthenticated = false;
      }
    });
  }

  signOut(){
    if(this.isUserAuthenticated){
        this.authService.SignOut().then(message=>{
          this.isUserAuthenticated = false;
          this.closeAccountPopover();
          this.toast.showToast('Berhasil keluar', 4000, 'dark');
        });
    }
  }

  openLogin(){
    this.closeAccountPopover();
    this.router.navigate(['/login']);
  }

  openRegister(){
    this.closeAccountPopover();
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    if(this.unsubscribe)
      this.unsubscribe();
  }

}
