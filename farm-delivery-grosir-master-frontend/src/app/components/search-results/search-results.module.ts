import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultsComponent } from './search-results.component';
import { MainPipeModule } from '../../pipes/main-pipe.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [SearchResultsComponent],
    exports: [SearchResultsComponent],
    imports: [IonicModule, CommonModule, MainPipeModule]
})
export class SearchResultsModule{};