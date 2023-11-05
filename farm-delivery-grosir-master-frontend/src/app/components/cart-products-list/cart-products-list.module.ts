import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CartProductsListComponent } from './cart-products-list.component';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { EmailVerificationModule } from '../email-verification/email-verification.module';

@NgModule({
    declarations: [CartProductsListComponent],
    exports: [CartProductsListComponent],
    imports: [IonicModule, CommonModule, EmailVerificationModule, ReactiveFormsModule, MainPipeModule]
})
export class CartProductsListModule{};