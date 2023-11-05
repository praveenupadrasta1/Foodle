import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CategoriesComponent } from './categories.component';

@NgModule({
    declarations: [CategoriesComponent],
    exports: [CategoriesComponent],
    imports: [IonicModule, CommonModule]
})
export class CategoriesModule{};