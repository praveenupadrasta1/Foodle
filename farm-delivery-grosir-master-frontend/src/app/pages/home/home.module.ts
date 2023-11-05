import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { ToolbarModule } from '../../components/toolbar/toolbar.module';
import { SelectDeliveryAreaDateTimeModule } from '../../components/select-delivery-area-date-time/select-delivery-area-date-time.module';
import { BannerModule } from '../../components/banner/banner.module';
import { CategoriesModule } from '../../components/categories/categories.module';
import { CartModule } from '../../components/cart/cart.module';
// import { CartProductsListModule } from '../../components/cart-products-list/cart-products-list.module';
import { SearchBarGlobalModule } from '../../components/search-bar-global/search-bar-global.module';
import { ModalBaseModule } from '../../components/modal-base-component/modal-base-component.module';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { BarcodeScannerModule } from '../../components/barcode-scanner/barcode-scanner.module';
import { AccountPopoverModule } from '../../components/account-popover/account-popover.module';
import { FeaturedProductsModule } from '../../components/featured-products/featured-products.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToolbarModule,
    SelectDeliveryAreaDateTimeModule,
    BannerModule,
    CategoriesModule,
    CartModule,
    // CartProductsListModule,
    MainPipeModule,
    ModalBaseModule,
    HomePageRoutingModule,
    BarcodeScannerModule,
    SearchBarGlobalModule,
    AccountPopoverModule,
    FeaturedProductsModule
  ],
  declarations: [HomePage],
  providers: []
})
export class HomePageModule {};
