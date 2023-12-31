import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyordersPageRoutingModule } from './myorders-routing.module';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { MyordersPage } from './myorders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPipeModule,
    MyordersPageRoutingModule
  ],
  declarations: [MyordersPage]
})
export class MyordersPageModule {}
