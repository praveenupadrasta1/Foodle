import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EmailVerificationComponent } from './email-verification.component';
import { MainPipeModule } from '../../pipes/main-pipe.module';

@NgModule({
    declarations: [EmailVerificationComponent],
    exports: [EmailVerificationComponent],
    imports: [IonicModule, CommonModule, ReactiveFormsModule, MainPipeModule]
})
export class EmailVerificationModule{};