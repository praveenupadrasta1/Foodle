import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';
import { FirebaseAuthModalModule } from '../../components/firebase-auth-modal/firebase-auth-modal.module';

import { ProductsPage } from './products.page';
import { ModalBaseModule } from '../../components/modal-base-component/modal-base-component.module';
import { ProductsModule } from '../../components/products/products.module'
import { SearchBarGlobalModule } from '../../components/search-bar-global/search-bar-global.module';
import { CartModule } from '../../components/cart/cart.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsModule,
    SearchBarGlobalModule,
    CartModule,
    ModalBaseModule,
    FirebaseAuthModalModule,
    ProductsPageRoutingModule
  ],
  declarations: [ProductsPage]
})
export class ProductsPageModule {}
