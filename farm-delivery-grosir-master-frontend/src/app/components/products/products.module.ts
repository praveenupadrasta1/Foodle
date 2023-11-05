import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsComponent } from './products.component';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { FirebaseAuthModalModule } from '../../components/firebase-auth-modal/firebase-auth-modal.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ProductsComponent],
    exports: [ProductsComponent],
    imports: [IonicModule, CommonModule, MainPipeModule, FirebaseAuthModalModule]
})
export class ProductsModule{};