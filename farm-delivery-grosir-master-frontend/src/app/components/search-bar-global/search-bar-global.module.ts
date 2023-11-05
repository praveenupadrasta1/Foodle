import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchBarGlobalComponent } from './search-bar-global.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [SearchBarGlobalComponent],
    exports: [SearchBarGlobalComponent],
    imports: [IonicModule, CommonModule]
})
export class SearchBarGlobalModule{};