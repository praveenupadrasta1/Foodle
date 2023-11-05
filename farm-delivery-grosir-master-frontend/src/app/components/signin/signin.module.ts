import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninComponent } from './signin.component';

import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [SigninComponent],
    exports: [SigninComponent],
    imports: [IonicModule, CommonModule, ReactiveFormsModule, IonicModule]
})
export class SigninModule{};