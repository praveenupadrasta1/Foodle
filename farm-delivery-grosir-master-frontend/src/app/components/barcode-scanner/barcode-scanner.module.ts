import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeScannerComponent } from './barcode-scanner.component';

@NgModule({
    declarations: [BarcodeScannerComponent],
    exports: [BarcodeScannerComponent],
    imports: [IonicModule, CommonModule],
    providers: [BarcodeScanner]
})
export class BarcodeScannerModule{};