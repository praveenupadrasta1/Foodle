import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ToastService } from '../../shared-services/toast-service/toast.service';

declare let window: any;

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
})
export class BarcodeScannerComponent implements OnInit {

  private barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private barcodeScanner: BarcodeScanner,
              private toast: ToastService,
              private router: Router) { 
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true,
      prompt: 'Tempatkan barcode di dalam persegi panjang untuk scan'
    };
  }

  ngOnInit() {}

  scanBarcode(){
    this.barcodeScanner.scan(this.barcodeScannerOptions).then(barcodeData => {
      this.router.navigate(['/search_results/'+barcodeData['text']+'/1']);
    }).catch(error => {
      this.toast.showToast("Tidak dapat membuka Barcode Scanner! Pastikan Anda menggunakan aplikasi seluler, bukan browser!",
                                5000, 'dark');
    });
  }
}
