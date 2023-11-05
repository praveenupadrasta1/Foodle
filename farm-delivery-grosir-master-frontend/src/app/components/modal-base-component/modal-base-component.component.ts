import { Component, OnInit } from '@angular/core';
import { CartProductsListComponent } from '../cart-products-list/cart-products-list.component';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-modal-base-component',
  templateUrl: './modal-base-component.component.html',
  styleUrls: ['./modal-base-component.component.scss'],
})
export class ModalBaseComponent implements OnInit {

  root = CartProductsListComponent;

  rootParams: any;

  constructor(private navParams: NavParams) { }

  ngOnInit() {
    let productsData = this.navParams.get('response');
    this.rootParams = productsData;
  }

}
