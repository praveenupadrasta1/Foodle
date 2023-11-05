import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlobalSearchPage } from './global-search.page';

const routes: Routes = [
  {
    path: '',
    component: GlobalSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalSearchPageRoutingModule {}
