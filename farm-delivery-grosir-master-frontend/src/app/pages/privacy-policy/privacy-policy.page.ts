import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {

  htmlStr: string = '';
  language = 'Indonesian';

  constructor() { }

  ngOnInit() {
    if(this.language === 'English'){
      this.htmlStr = '<h2><strong>PRIVACY POLICY</strong></h2>\
      <p>&nbsp;</p>\
      <p><strong>Privacy Policy</strong></p>\
      <p><span style="font-weight: 400;">This privacy policy has been compiled to better serve those who are concerned with how their \'Personally Identifiable Information\' (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</span></p>\
      <p>&nbsp;</p>\
      <ul>\
      <li><strong><strong>What personal information do we collect from the people that visit our website/app?</strong><strong><br /></strong><span style="font-weight: 400;">When ordering or registering on our site/app, as appropriate, you may be asked to enter your name, email address, mailing address, phone number and also collect the location info or other details to help you with your experience.</span></strong></li>\
      </ul>\
      <ul>\
      <li><strong>When do we collect information?</strong><strong><br /></strong><span style="font-weight: 400;">We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form or enter information on our site, provide us with feedback on our products or services.</span></li>\
      </ul>\
      <ul>\
      <li><strong>How do we use your information?</strong><strong><br /></strong><span style="font-weight: 400;">We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways: To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested. To improve our website in order to better serve you.&nbsp;</span></li>\
      </ul>\
      <p><span style="font-weight: 400;">To allow us to better service you in responding to your customer service requests. To administer a contest, promotion, survey or other site feature. To quickly process your transactions. To ask for ratings and reviews of services or products To follow up with them after correspondence (live chat, email or phone inquiries)</span></p>\
      <p>&nbsp;</p>\
      <ul>\
      <li><strong><strong>How do we protect your information?</strong><strong><br /></strong><span style="font-weight: 400;">We do not use vulnerability scanning and/or scanning to PCI standards. We only provide articles and information. We never ask for credit card numbers. We do not use Malware Scanning. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology. We implement a variety of security measures when a user places an order, enters, submits, or accesses their information to maintain the safety of your personal information. All transactions are processed through a gateway provider and are not stored or processed on our servers.</span></strong></li>\
      </ul>\
      <ul>\
      <li><strong>Do we use \'cookies\'?</strong><strong><br /></strong><span style="font-weight: 400;">Yes. Cookies are small files that a site or its service provider transfers to your computer\'s hard drive through your Web browser (if you allow) that enables the site\'s or service provider\'s systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</span></li>\
      </ul>\
      <p>&nbsp;</p>\
      <p><strong>We use cookies to: </strong><span style="font-weight: 400;">Help remember and process the items in the shopping cart. Understand and save user\'s preferences for future visits. Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future. We may also use trusted third-party services that track this information on our behalf. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since the browser is a little different, look at your browser\'s Help Menu to learn the correct way to modify your cookies.</span></p>\
      <p><strong>If users disable cookies in their browser: </strong><span style="font-weight: 400;">If you turn cookies off, some features will be disabled, including some of the features that make your site experience more efficient and may not function properly. However, you will still be able to place orders by contacting customer service.</span></p>\
      <p>&nbsp;</p>\
      <p><strong>Third-party disclosure</strong></p>\
      <p><span style="font-weight: 400;">We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it\'s release is appropriate to comply with the law, enforce our site policies, or protect ours or others\' rights, property or safety.</span></p>\
      <p><span style="font-weight: 400;">However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</span></p>\
      <p>&nbsp;</p>\
      <p><strong>Third-party links</strong></p>\
      <p><span style="font-weight: 400;">Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</span></p>\
      <p><strong>Google</strong></p>\
      <p><span style="font-weight: 400;">Google\'s advertising requirements can be summed up by Google\'s Advertising Principles. They are put in place to provide a positive experience for users.</span></p>\
      <p><strong>We use Google AdSense Advertising on our website.</strong></p>\
      <p><span style="font-weight: 400;">Google, as a third-party vendor, uses cookies to serve ads on our site. Google\'s use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.</span></p>\
      <p><strong>We have implemented the following:</strong></p>\
      <ul>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">Demographics and Interests Reporting</span></li>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website.Opting out:</span></li>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising Initiative Opt Out page or by using the Google Analytics Opt Out Browser add on.</span></li>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">How does our site handle Do Not Track signals?</span></li>\
      <ul>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.CAN-SPAM Act</span></li>\
      </ul>\
      </ul>\
      <p><span style="font-weight: 400;">The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements</span></p>\
      <p><span style="font-weight: 400;">for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.</span></p>\
      <p><span style="font-weight: 400;"><br /></span><strong>We collect your email address in order to:</strong><span style="font-weight: 400;"><br /></span><span style="font-weight: 400;">Send information, respond to inquiries, and/or other requests or questions Process orders and to send information and updates pertaining to orders. Send you additional information related to your product and/or service Market to our mailing list or continue to send emails to our clients after the original transaction has occurred.</span><span style="font-weight: 400;"><br /></span><span style="font-weight: 400;">To be in accordance with CAN-SPAM, we agree to the following: Not use false or misleading subjects or email addresses. Identify the message as an advertisement in some reasonable way. Include the physical address of our business or site headquarters. Monitor third-party email marketing services for compliance, if one is used. Honor opt-out/unsubscribe requests quickly. Allow users to unsubscribe by using the link at the bottom of each email.</span><span style="font-weight: 400;"><br /></span><span style="font-weight: 400;">I</span><span style="font-weight: 400;">f at any time you would like to unsubscribe from receiving future emails, you can email us at</span><strong> customersupport@foodle.id </strong><span style="font-weight: 400;">and we will promptly remove you from ALL correspondence.</span></p>\
      <h2><br /><br /></h2>\
      <p><strong>Last Edited on 2020-Sep-06</strong></p>';
    }
    else{
      this.htmlStr = '<h2><strong>PRIVASI dan KEBIJAKAN</strong></h2>\
      <h2>&nbsp;</h2>\
      <p><strong>PRIVASI dan KEBIJAKAN</strong></p>\
      <p><span style="font-weight: 400;">Kebijakan privasi ini telah disusun untuk melayani mereka yang peduli dengan bagaimana \'Informasi Identifikasi Pribadi\' (PII) mereka digunakan secara online. PII, seperti yang dijelaskan dalam hukum privasi AS dan keamanan informasi, adalah informasi yang dapat digunakan sendiri atau dengan informasi lain untuk mengidentifikasi, menghubungi, atau menemukan satu orang, atau untuk mengidentifikasi individu dalam konteks.&nbsp;</span></p>\
      <p><span style="font-weight: 400;">Harap baca kebijakan privasi kami dengan cermat untuk mendapatkan pemahaman yang jelas tentang bagaimana kami mengumpulkan, menggunakan, melindungi atau menangani Informasi Identitas Pribadi Anda sesuai dengan situs web kami.</span></p>\
      <p>&nbsp;</p>\
      <ul>\
      <li><strong><strong>Informasi pribadi apa yang kami kumpulkan dari orang-orang yang mengunjungi situs web / aplikasi kami?</strong><strong><br /></strong><span style="font-weight: 400;">Saat memesan atau mendaftar di situs / aplikasi kami, jika sesuai, Anda mungkin diminta untuk memasukkan nama, alamat email, alamat surat, nomor telepon, dan juga mengumpulkan info lokasi atau detail lainnya untuk membantu pengalaman Anda.</span></strong></li>\
      </ul>\
      <ul>\
      <li><strong>Kapan kami mengumpulkan informasi?</strong><strong><br /></strong><span style="font-weight: 400;">Kami mengumpulkan informasi dari Anda ketika Anda mendaftar di situs kami, melakukan pemesanan, berlangganan buletin, menanggapi survei, mengisi formulir atau memasukkan informasi di situs kami, memberi kami umpan balik tentang produk atau layanan kami.</span></li>\
      </ul>\
      <p>&nbsp;</p>\
      <ul>\
      <li><strong><strong>Bagaimana kami menggunakan informasi Anda?</strong></strong></li>\
      </ul>\
      <p>&nbsp;</p>\
      <p><span style="font-weight: 400;">Kami dapat menggunakan informasi yang kami kumpulkan dari Anda saat Anda mendaftar, melakukan pembelian, mendaftar untuk buletin kami, menanggapi survei atau komunikasi pemasaran, menjelajahi situs web, atau menggunakan fitur situs tertentu lainnya dengan cara berikut: Untuk mempersonalisasi pengalaman Anda dan untuk memungkinkan kami menyampaikan jenis konten dan penawaran produk yang paling Anda minati, untuk meningkatkan situs web kami agar dapat melayani Anda dengan lebih baik, untuk memungkinkan kami melayani Anda dengan lebih baik dalam menanggapi permintaan layanan pelanggan Anda, untuk mengelola kontes, promosi, survei, atau fitur situs lainnya, Untuk memproses transaksi Anda dengan cepat, untuk meminta penilaian dan ulasan tentang layanan atau produk, untuk menindaklanjuti dengan mereka setelah korespondensi (obrolan langsung, email atau pertanyaan telepon)</span></p>\
      <p>&nbsp;</p>\
      <ul>\
      <li><strong><strong>Bagaimana kami melindungi informasi Anda?</strong><strong><br /></strong><span style="font-weight: 400;">Kami tidak menggunakan pemindaian kerentanan dan / atau pemindaian dengan standar PCI. Kami hanya menyediakan artikel dan informasi. Kami tidak pernah meminta nomor kartu kredit. Kami tidak menggunakan Pemindaian Malware. Informasi pribadi Anda terdapat di balik jaringan yang aman dan hanya dapat diakses oleh sejumlah orang yang memiliki hak akses khusus ke sistem tersebut, dan diharuskan untuk menjaga kerahasiaan informasi tersebut. Selain itu, semua informasi sensitif / kredit yang Anda berikan dienkripsi melalui teknologi Secure Socket Layer (SSL). Kami menerapkan berbagai langkah keamanan saat pengguna melakukan pemesanan, memasukkan, atau mengakses informasi mereka untuk menjaga keamanan informasi pribadi Anda. Semua transaksi diproses melalui penyedia gateway dan tidak disimpan atau diproses di server kami.</span></strong></li>\
      <li style="font-weight: 400;"><strong>Apakah kami menggunakan \'cookie\'?</strong><span style="font-weight: 400;"><br /></span><span style="font-weight: 400;">Iya. Cookie adalah file kecil yang ditransfer oleh situs atau penyedia layanan ke hard drive komputer Anda melalui browser Web Anda (jika Anda mengizinkan) yang memungkinkan sistem situs atau penyedia layanan untuk mengenali browser Anda dan menangkap serta mengingat informasi tertentu. Misalnya, kami menggunakan cookie untuk membantu kami mengingat dan memproses item di keranjang belanja Anda. Mereka juga digunakan untuk membantu kami memahami preferensi Anda berdasarkan aktivitas situs sebelumnya atau&nbsp;</span>saat ini, yang memungkinkan kami memberi Anda layanan yang lebih baik. Kami juga menggunakan cookie untuk membantu kami mengumpulkan data agregat tentang lalu lintas situs dan interaksi situs sehingga kami dapat menawarkan pengalaman dan alat situs yang lebih baik di masa mendatang<span style="font-weight: 400;">.</span></li>\
      </ul>\
      <p><span style="font-weight: 400;">Kami menggunakan cookie untuk: Membantu mengingat dan memproses item di keranjang belanja. Pahami dan simpan preferensi pengguna untuk kunjungan mendatang. Kumpulkan data gabungan tentang lalu lintas situs dan interaksi situs untuk menawarkan pengalaman situs dan alat yang lebih baik di masa mendatang. Kami juga dapat menggunakan layanan pihak ketiga tepercaya yang melacak informasi ini atas nama kami. Anda dapat memilih agar komputer Anda memperingatkan Anda setiap kali cookie dikirim, atau Anda dapat memilih untuk mematikan semua cookie. Anda melakukan ini melalui pengaturan browser Anda. Karena browser sedikit berbeda, lihat Menu Bantuan browser Anda untuk mempelajari cara yang benar untuk mengubah cookie Anda. Jika pengguna menonaktifkan cookie di browser mereka: Jika Anda mematikan cookie, beberapa fitur akan dinonaktifkan, termasuk beberapa fitur yang membuat pengalaman situs Anda lebih efisien dan mungkin tidak berfungsi dengan baik. Namun, Anda tetap akan menjadi Ble untuk memesan dengan menghubungi layanan pelanggan.</span></p>\
      <p><strong>Pengungkapan pihak ketiga</strong></p>\
      <p><span style="font-weight: 400;">Kami tidak menjual, memperdagangkan, atau mentransfer ke pihak luar Informasi Identitas Pribadi Anda kecuali kami memberikan pemberitahuan sebelumnya kepada pengguna. Ini tidak termasuk mitra hosting situs web dan pihak lain yang membantu kami dalam mengoperasikan situs web kami, menjalankan bisnis kami, atau melayani pengguna kami, selama pihak tersebut setuju untuk merahasiakan informasi ini. Kami juga dapat merilis informasi ketika rilisnya sesuai untuk mematuhi hukum, menegakkan kebijakan situs kami, atau melindungi hak, properti, atau keamanan kami atau orang lain.</span></p>\
      <p><span style="font-weight: 400;">Namun, informasi pengunjung yang tidak dapat diidentifikasi secara pribadi dapat diberikan kepada pihak lain untuk pemasaran, periklanan, atau penggunaan lainnya.</span></p>\
      <p>&nbsp;</p>\
      <p><strong>Tautan pihak ketiga</strong></p>\
      <p><span style="font-weight: 400;">Terkadang, atas kebijaksanaan kami, kami dapat menyertakan atau menawarkan produk atau layanan pihak ketiga di situs web kami. Situs pihak ketiga ini memiliki kebijakan privasi yang terpisah dan independen. Oleh karena itu, kami tidak bertanggung jawab atau berkewajiban atas konten dan aktivitas situs terkait ini.&nbsp;</span></p>\
      <p><span style="font-weight: 400;">Meskipun demikian, kami berusaha melindungi integritas situs kami dan menerima umpan balik apa pun tentang situs ini.</span></p>\
      <p><strong>Google</strong></p>\
      <p><span style="font-weight: 400;">Persyaratan periklanan Google dapat diringkas dengan Prinsip Periklanan Google. Mereka disiapkan untuk memberikan pengalaman positif bagi pengguna. Tautan referensi.</span></p>\
      <p><span style="font-weight: 400;">Kami menggunakan Iklan </span><em><span style="font-weight: 400;">Google AdSense</span></em><span style="font-weight: 400;"> di situs web kami.</span></p>\
      <p><span style="font-weight: 400;">Google, sebagai vendor pihak ketiga, menggunakan cookie untuk menayangkan iklan di situs kami. Penggunaan cookie DART oleh Google memungkinkannya untuk menayangkan iklan kepada pengguna kami berdasarkan kunjungan sebelumnya ke situs kami dan situs lain di Internet. Pengguna dapat memilih keluar dari penggunaan cookie DART dengan mengunjungi iklan Google dan kebijakan privasi Jaringan Konten.</span></p>\
      <p><strong>Kami telah menerapkan sebagai berikut:</strong></p>\
      <ul>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">Pelaporan Demografi dan Minat</span></li>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">Kami, bersama dengan vendor pihak ketiga seperti Google menggunakan cookie pihak pertama (seperti cookie Google Analytics) dan cookie pihak ketiga (seperti cookie DoubleClick) atau pengenal pihak ketiga lainnya bersama-sama untuk mengumpulkan data terkait interaksi pengguna dengan tayangan iklan dan fungsi layanan iklan lainnya yang terkait dengan situs web kami.Menyisih:</span></li>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">Pengguna dapat mengatur preferensi bagaimana Google mengiklankan kepada Anda menggunakan halaman Pengaturan Iklan Google. Cara lainnya, Anda dapat menyisih dengan mengunjungi halaman Penyisihan Prakarsa Periklanan Jaringan atau dengan menggunakan pengaya Peramban Penyisih Google Analytics.Bagaimana situs kami menangani sinyal Jangan Lacak?</span></li>\
      <li style="font-weight: 400;"><span style="font-weight: 400;">Kami menghormati sinyal Jangan Lacak dan Jangan Lacak, menanam cookie, atau menggunakan iklan saat mekanisme browser Jangan Lacak (DNT) diterapkan.CAN-SPAM Act</span></li>\
      </ul>\
      <p><span style="font-weight: 400;">Undang-undang CAN-SPAM adalah undang-undang yang menetapkan aturan untuk email komersial, menetapkan persyaratan untuk pesan komersial, memberikan hak kepada penerima untuk menghentikan pengiriman email kepada mereka, dan menjabarkan hukuman berat untuk pelanggaran.</span></p>\
      <p><strong><br /></strong><strong>Kami mengumpulkan alamat email Anda untuk:</strong></p>\
      <p><strong><br /></strong> <span style="font-weight: 400;">Mengirim informasi, menjawab pertanyaan, dan / atau permintaan atau pertanyaan lainnya Memproses pesanan dan mengirim informasi dan pembaruan yang berkaitan dengan pesanan. Mengirimkan informasi tambahan terkait dengan produk dan / atau layanan Anda Pasarkan ke milis kami atau terus kirim email ke klien kami setelah transaksi asli terjadi.</span><span style="font-weight: 400;"><br /></span> <span style="font-weight: 400;">Agar sesuai dengan CAN-SPAM, kami menyetujui yang berikut: Tidak menggunakan subjek atau alamat email yang salah atau menyesatkan. Identifikasi pesan sebagai iklan dengan cara yang masuk akal. Cantumkan alamat fisik kantor pusat bisnis atau situs kita. Pantau layanan pemasaran email pihak ketiga untuk kepatuhan, jika ada yang digunakan. Hormati permintaan opt-out / unsubscribe dengan cepat. Izinkan pengguna untuk berhenti berlangganan dengan menggunakan tautan di bagian bawah setiap email.</span><span style="font-weight: 400;"><br /></span> <span style="font-weight: 400;">Jika suatu saat Anda ingin berhenti berlangganan dari menerima email di masa mendatang, Anda dapat mengirim email kepada kami di </span><strong>customersupport@foodle.id </strong><span style="font-weight: 400;">dan kami akan segera menghapus Anda dari SEMUA korespondensi.</span></p>\
      <p><span style="font-weight: 400;">Terakhir diedit pada 2020-Sep-05</span></p>';
    }
  }

}
