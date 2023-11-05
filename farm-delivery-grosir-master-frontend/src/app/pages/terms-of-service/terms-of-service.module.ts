import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermsOfServicePageRoutingModule } from './terms-of-service-routing.module';

import { TermsOfServicePage } from './terms-of-service.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsOfServicePageRoutingModule
  ],
  declarations: [TermsOfServicePage]
})
export class TermsOfServicePageModule {}
