import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.page.html',
  styleUrls: ['./refund-policy.page.scss'],
})
export class RefundPolicyPage implements OnInit {

  htmlStr: string = '';
  language = 'Indonesian';

  constructor() { }

  ngOnInit() {
    if(this.language === 'English'){
      this.htmlStr = '<p><span style="color: #ff6600;"><strong>Rejection</strong></span></p>\
      <p><span style="font-weight: 400;">You understand that at the time of ordering a product if it is not available for any reason, Foodle will notify you via e-mail or telephone listed in the Application that the product is not available and offer your willingness to wait or make a refund. Refund process takes no later than 10 (ten) working days after notification.</span></p>\
      <p><strong>&nbsp;</strong></p>\
      <p><span style="color: #ff6600;"><strong>Cancellation</strong></span></p>\
      <p><span style="font-weight: 400;">Once the product(s) or service(s) are purchased, you cannot cancel the product(s) or service(s) that has been purchased.</span></p>\
      <p><strong>&nbsp;</strong></p>\
      <p><span style="color: #ff6600;"><strong>Return Policy</strong></span></p>\
      <p><span style="font-weight: 400;">Foodle makes every effort to deliver products that are suitable for you, but if you are sent a product that you think is not suitable, you have the right to refuse when the product arrives at your order address by providing a valid and genuine reason why the product cannot be accepted.</span></p>\
      <p><span style="font-weight: 400;">However, if the product has been received as evidenced by proof of the recipient, then you cannot apply for a refund.</span></p>\
      <p><span style="font-weight: 400;">Therefore, you are obliged to check carefully that the product you receive is appropriate before the delivery person leaves your premises.</span></p>\
      <p><span style="font-weight: 400;">Refund policy for non-conforming products will be processed no later than 10 (ten) working days after you provide your bank account number to the Foodle team </span><strong>(email: <span style="color: #ff6600;">customersupport@foodle.id</span>)</strong><span style="font-weight: 400;"> for refund purposes.</span></p>\
      <h1>&nbsp;</h1>\
      <p><strong>Last Edited on 2020-Sep-06</strong></p>\
      <h1><br /><br /></h1>'
    }
    else {
      this.htmlStr = '<p><strong>Penolakan</strong></p>\
      <p><span style="font-weight: 400;">Anda memahami jika pada saat memesan produk tidak tersedia karena alasan apapun, Foodle akan memberitahu Anda melalui email atau telepon yang tercantum dalam Aplikasi bahwa produk tidak tersedia dan menawarkan kesediaan Anda untuk menunggu atau melakukan pengembalian uang. Proses pengembalian dana membutuhkan waktu paling lambat 10 (sepuluh) hari kerja setelah pemberitahuan.</span></p>\
      <p><strong>Pembatalan</strong></p>\
      <p><span style="font-weight: 400;">Setelah produk atau layanan dibeli, Anda tidak dapat membatalkan produk atau layanan yang telah dibeli.</span></p>\
      <p><strong>Kebijakan Pengembalian</strong></p>\
      <p><span style="font-weight: 400;">Foodle berusaha semaksimal mungkin untuk mengirimkan produk yang sesuai untuk Anda, tetapi jika Anda dikirimi produk yang menurut Anda tidak sesuai, Anda memiliki hak untuk menolak saat produk tersebut sampai di alamat&nbsp; pesanan Anda dengan memberikan alasan yang valid mengapa produk tersebut tidak dapat diterima.</span></p>\
      <p><span style="font-weight: 400;">Namun, jika produk sudah diterima yang dibuktikan dengan bukti penerima, maka Anda tidak dapat mengajukan pengembalian uang.</span></p>\
      <p><span style="font-weight: 400;">Oleh karena itu, Anda wajib memeriksa dengan cermat apakah produk yang Anda terima sudah sesuai sebelum kurir atau pengantar meninggalkan tempat Anda.</span></p>\
      <p><span style="font-weight: 400;">Kebijakan refund untuk produk yang tidak sesuai akan diproses selambat-lambatnya 10 (sepuluh) hari kerja setelah Anda memberikan nomor akun Anda kepada tim Foodle </span><strong>(email: customersupport@foodle.id)</strong><span style="font-weight: 400;"> untuk keperluan refund.</span></p>\
      <p>&nbsp;</p>\
      <p><strong>Terakhir Diedit pada 2020-Sep-09</strong></p>';
    }
  }

}
