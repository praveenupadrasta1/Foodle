import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

// import { FirebaseAuthProviderService } from '../../api/authentication/firebase-auth-provider.service';

@Component({
  selector: 'app-firebase-auth-modal',
  templateUrl: './firebase-auth-modal.component.html',
  styleUrls: ['./firebase-auth-modal.component.scss'],
})
export class FirebaseAuthModalComponent implements OnInit {

  constructor(private modalController: ModalController,
              private router: Router) { }

  ngOnInit() {
    // this.authProvider.ui.start('#firebaseui-auth-container', FirebaseAuthProviderService.getUiConfig());
  }

  goToLoginPage(){
    this.closeModal();
    this.router.navigate(['/login']);
  }

  closeModal(){
    this.modalController.dismiss();
  }
}
