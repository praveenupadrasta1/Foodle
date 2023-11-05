import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisComponent } from './regis.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [RegisComponent],
    exports: [RegisComponent],
    imports: [CommonModule, ReactiveFormsModule, IonicModule]
})
export class RegisModule{};