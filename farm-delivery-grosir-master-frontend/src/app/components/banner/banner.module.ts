import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicImageLoader } from 'ionic-image-loader';

import { BannerComponent } from './banner.component';

@NgModule({
    declarations: [BannerComponent],
    exports: [BannerComponent],
    imports: [IonicModule, CommonModule,
            IonicImageLoader]
})
export class BannerModule{};