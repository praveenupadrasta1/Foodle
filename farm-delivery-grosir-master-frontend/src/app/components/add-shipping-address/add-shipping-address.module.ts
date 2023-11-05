import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AddShippingAddressComponent } from './add-shipping-address.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [AddShippingAddressComponent],
    exports: [AddShippingAddressComponent],
    imports: [IonicModule,CommonModule, ReactiveFormsModule]
})
export class AddShippingAddressModule{};