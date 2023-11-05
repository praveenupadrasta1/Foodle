import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductSearchResultsPageRoutingModule } from './product-search-results-routing.module';
import { ProductSearchResultsPage } from './product-search-results.page';
import { SearchResultsModule } from '../../components/search-results/search-results.module';
import { CartModule } from '../../components/cart/cart.module';
import { ModalBaseModule } from '../../components/modal-base-component/modal-base-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchResultsModule,
    CartModule,
    ModalBaseModule,
    ProductSearchResultsPageRoutingModule
  ],
  declarations: [ProductSearchResultsPage]
})
export class ProductSearchResultsPageModule {}
