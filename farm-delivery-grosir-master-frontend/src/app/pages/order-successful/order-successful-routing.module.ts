import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderSuccessfulPage } from './order-successful.page';

const routes: Routes = [
  {
    path: '',
    component: OrderSuccessfulPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderSuccessfulPageRoutingModule {}
