import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirebaseAuthModalComponent } from './firebase-auth-modal.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [FirebaseAuthModalComponent],
    exports: [FirebaseAuthModalComponent],
    imports: [IonicModule, CommonModule]
})
export class FirebaseAuthModalModule{};