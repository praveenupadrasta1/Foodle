import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShippingAddressSelectorComponent } from './shipping-address-selector.component';
import { UpdateShippingAddressModule } from '../update-shipping-address/update-shipping-address.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ShippingAddressSelectorComponent],
    exports: [ShippingAddressSelectorComponent],
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, UpdateShippingAddressModule]
})
export class ShippingAddressSelectorModule{};