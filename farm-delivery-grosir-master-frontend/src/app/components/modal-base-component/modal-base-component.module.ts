import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalBaseComponent } from './modal-base-component.component';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { CartProductsListModule } from '../cart-products-list/cart-products-list.module';

@NgModule({
    declarations: [ModalBaseComponent],
    exports: [ModalBaseComponent],
    imports: [CommonModule, CartProductsListModule, ReactiveFormsModule, IonicModule, MainPipeModule]
})
export class ModalBaseModule{};