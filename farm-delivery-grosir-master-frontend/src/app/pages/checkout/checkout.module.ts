import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { CheckoutPage } from './checkout.page';
import { ShippingAddressSelectorModule } from '../../components/shipping-address-selector/shipping-address-selector.module';
import { AddShippingAddressModule } from '../../components/add-shipping-address/add-shipping-address.module';
import { UpdateShippingAddressModule } from '../../components/update-shipping-address/update-shipping-address.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MainPipeModule,
    ShippingAddressSelectorModule,
    CheckoutPageRoutingModule,
    AddShippingAddressModule,
    UpdateShippingAddressModule
  ],
  declarations: [CheckoutPage]
})
export class CheckoutPageModule {}
