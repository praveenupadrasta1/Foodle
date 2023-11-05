import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductSearchResultsPage } from './product-search-results.page';

const routes: Routes = [
  {
    path: '',
    component: ProductSearchResultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductSearchResultsPageRoutingModule {}
