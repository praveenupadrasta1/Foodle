import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectDeliveryAreaDateTimeComponent } from './select-delivery-area-date-time.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [SelectDeliveryAreaDateTimeComponent],
    exports: [SelectDeliveryAreaDateTimeComponent],
    imports: [IonicModule, CommonModule]
})
export class SelectDeliveryAreaDateTimeModule{};