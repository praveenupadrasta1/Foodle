import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPipeModule } from '../../pipes/main-pipe.module';
import { FeaturedProductsComponent } from './featured-products.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [FeaturedProductsComponent],
    exports: [FeaturedProductsComponent],
    imports: [IonicModule, CommonModule, MainPipeModule]
})
export class FeaturedProductsModule{};