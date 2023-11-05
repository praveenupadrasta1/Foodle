import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartComponent } from './cart.component';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [CartComponent],
    exports: [CartComponent],
    imports: [IonicModule, CommonModule, MainPipeModule]
})
export class CartModule{};