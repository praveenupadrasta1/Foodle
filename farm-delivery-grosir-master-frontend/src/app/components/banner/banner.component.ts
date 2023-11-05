import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { GetBannerService } from '../../api/banner/get-banner.service'
import { storeInSession, getFromSession } from '../../utils/session-storage';
import { getCurrentDateTime } from '../../utils/date-time';
import { BannerInfoDeliverService } from '../../shared-services/banner-info-deliver/banner-info-deliver.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit, OnChanges {
  
  @Input() doRefresh: boolean; 
  
  slideOpts = {
    initialSlide: 1,
    speed: 2000,
    autoplay: {
      disableOnInteraction: false
    },
    slidesPerView: 1.1,
    spaceBetween: 10 
  };

  bannersData = [];
  generatedDateTime: any;
  mySubscription: any;
  imgUrl: string;

  constructor(private getBanner: GetBannerService,
              private platform: Platform,
              private router: Router,
              private bannerInfoDeliverService: BannerInfoDeliverService ) { 

    this.platform.resize.subscribe(async() => { 
      this.getImageUrl();
    });
  }

  ngOnChanges(changes){
    this.ngOnInit();
  }

  ngOnInit() {
    this.getImageUrl();
    this.bannersData = [];
    let bannersSessionData = [];
    bannersSessionData = getFromSession('banners');
    if(bannersSessionData){
      this.generatedDateTime = moment(moment.unix(bannersSessionData['timestamp'])
                                            .format(), 'YYYY-MM-DD hh:mm');
      let offetAddedDateTime = this.generatedDateTime.clone().add(10, 'minutes');
      if(getCurrentDateTime().isAfter(offetAddedDateTime)){
        this.getBannersFromFirebase();
      }
      else{
        this.getValidBanners(bannersSessionData['banners']);
      }
    }
    else{
      this.getBannersFromFirebase();
    }
  }

  getBannersFromFirebase(){
    let banners = [];
    this.getBanner.getBanners().subscribe((res) => {
      banners= res['banners'];
      this.generatedDateTime = moment(moment.unix(res['timestamp']).format('YYYY-MM-DD hh:mm'), 
                                                                      'YYYY-MM-DD hh:mm');
      if(banners.length != 0){
        this.getValidBanners(banners);
      }
      storeInSession('banners', res);
    },
    error => {
      // this.toast.showToast(error[keys.error][keys.error], 4000, 'dark');
    });
  }

  getValidBanners(banners){
    this.bannersData = [];
    for(let banner of banners){
      let from_date = moment(moment.unix(banner.date_from._seconds).format('YYYY-MM-DD hh:mm'), 
                                                                      'YYYY-MM-DD hh:mm');
      let to_date = moment(moment.unix(banner.date_to._seconds).format('YYYY-MM-DD hh:mm'), 
                                                                      'YYYY-MM-DD hh:mm');  
      if(this.generatedDateTime.isAfter(from_date) && this.generatedDateTime.isBefore(to_date)){
        this.bannersData.push(banner);
      }
    }
  }

  getImageUrl(){
    if(this.platform.width() > 1000){
      this.imgUrl = 'img_url_xlarge';
    }
    else if(this.platform.width() > 768 && this.platform.width() <=1000)
    {
      this.imgUrl = 'img_url_large';
    }
    else if(this.platform.width() > 500 && this.platform.width() <=768)
    {
      this.imgUrl = 'img_url_medium';
    }
    else{
      this.imgUrl = 'img_url_small';
    }
  }

  goToBannerPage(banner){
    if(banner.description != ''){
      this.bannerInfoDeliverService.setExtras(banner);
      this.router.navigate(['/banner']);
    }
  }
}
