import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderSuccessfulPageRoutingModule } from './order-successful-routing.module';

import { OrderSuccessfulPage } from './order-successful.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderSuccessfulPageRoutingModule
  ],
  declarations: [OrderSuccessfulPage]
})
export class OrderSuccessfulPageModule {}
