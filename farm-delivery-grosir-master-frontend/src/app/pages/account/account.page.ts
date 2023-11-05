import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  isBigScreen = false;
  selectedPath = '/account/myaccount';
  selectedPage = 'myaccount';

  pages = [
    {
      page: 'myaccount',
      title: 'Akun Saya',
      url: '/account/myaccount',
      icon: 'person-outline',
      color: "white"
    },
    {
      page: 'myorders',
      title: 'Pesanan Saya',
      url: '/account/myorders',
      icon: 'list-circle-outline',
      color: "white"
    }
  ];

  constructor(private router: Router,
    private platform: Platform) { 
    this.router.events.subscribe((event: RouterEvent)=>{
      this.selectedPath = event.url;
    });
    // this.platform.resize.subscribe(async() => {
    //   if(this.platform.width() > 768){
    //     if(!this.isBigScreen)
    //     {
    //       window.location.reload();
    //     }
    //     this.isBigScreen = true;
    //   }
    //   else
    //   {
    //     if(this.isBigScreen)
    //     {
    //       window.location.reload();
    //     }
    //     this.isBigScreen = false;
    //   }
    // });
    this.selectedPath = window.location.pathname;
    // console.log(this.selectedPath);
  }

  ngOnInit() {
    // if(this.platform.width() > 768){
    //   this.isBigScreen = true;
    // }
  }

}
