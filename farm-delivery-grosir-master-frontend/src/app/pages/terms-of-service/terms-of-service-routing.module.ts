import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsOfServicePage } from './terms-of-service.page';

const routes: Routes = [
  {
    path: '',
    component: TermsOfServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TermsOfServicePageRoutingModule {}
