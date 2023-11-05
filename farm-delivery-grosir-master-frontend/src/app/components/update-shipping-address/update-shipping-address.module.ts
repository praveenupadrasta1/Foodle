import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UpdateShippingAddressComponent } from './update-shipping-address.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [UpdateShippingAddressComponent],
    exports: [UpdateShippingAddressComponent],
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class UpdateShippingAddressModule{};