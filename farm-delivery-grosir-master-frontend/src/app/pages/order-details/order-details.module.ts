import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderDetailsPageRoutingModule } from './order-details-routing.module';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { OrderDetailsPage } from './order-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPipeModule,
    OrderDetailsPageRoutingModule
  ],
  declarations: [OrderDetailsPage]
})
export class OrderDetailsPageModule {}
