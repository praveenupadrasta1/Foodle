import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

import { BannerInfoDeliverService } from '../../shared-services/banner-info-deliver/banner-info-deliver.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.page.html',
  styleUrls: ['./banner.page.scss'],
})
export class BannerPage implements OnInit, OnDestroy {

  htmlStr: string = '';
  banner: any;
  bannerService: Subscription;
  imgUrl: string = '';

  constructor(private bannerInfoDeliverService: BannerInfoDeliverService,
              private router: Router,
              private platform: Platform) { }

  ngOnInit() {
    this.bannerService = this.bannerInfoDeliverService.getExtras.subscribe((bannerData) => {
      if(bannerData){
        this.banner = bannerData;
        this.htmlStr = this.banner.description;
        this.getImageUrl();
      }
      else{
        this.router.navigate(['/home']);
        this.ngOnDestroy();
      }
    });
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
  
  @HostListener('window:unload')
  ngOnDestroy(){
    this.bannerService.unsubscribe();
  }
}
