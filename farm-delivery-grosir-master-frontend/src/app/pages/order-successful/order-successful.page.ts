import { Component, OnInit, OnDestroy } from '@angular/core';
import { createAnimation, Animation } from '@ionic/core';
import { AnimationController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// import * as firebase from 'firebase/app';
import 'firebase/auth';

declare let confetti: any;
@Component({
  selector: 'app-order-successful',
  templateUrl: './order-successful.page.html',
  styleUrls: ['./order-successful.page.scss'],
})
export class OrderSuccessfulPage implements OnInit {

  orderStatus = false;
  checkoutId = "";
  unsubscribe: any;

  constructor(private animationCtrl: AnimationController,
              private activatedRoute: ActivatedRoute,
              private router: Router) { 
    // const animation: Animation = this.animationCtrl.create('')
    // .addElement(document.querySelector('.img-success'))
    // .duration(10000)
    // .fromTo('opacity', '1', '0.5');
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let queryParamX = params['x'];
      if(parseInt(queryParamX) == 1){
        this.orderStatus = true;
        confetti.gradient = true;
        confetti.start(2000, 50, 150);
      }
      else{
        this.orderStatus = false;
      }
    });
    // this.checkoutId = this.activatedRoute.snapshot.queryParamMap.get('y');
  }

  goHome(){
    this.router.navigate(['/home']);
  }

  goToMyOrders(){
    this.router.navigate(['/account/myorders']);
  }
}
