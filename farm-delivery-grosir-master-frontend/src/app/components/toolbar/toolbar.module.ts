import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarComponent } from './toolbar.component';
import { BarcodeScannerModule } from '../barcode-scanner/barcode-scanner.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    declarations: [ToolbarComponent],
    exports: [ToolbarComponent],
    imports: [IonicModule, CommonModule, BarcodeScannerModule],
})
export class ToolbarModule{};