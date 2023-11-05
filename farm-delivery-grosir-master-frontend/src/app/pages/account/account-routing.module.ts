import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountPage } from './account.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../myaccount/myaccount.module').then( m => m.MyaccountPageModule)
      },
      {
        path: 'myaccount',
        loadChildren: () => import('../myaccount/myaccount.module').then( m => m.MyaccountPageModule)
      },
      {
        path: 'myorders',
        loadChildren: () => import('../myorders/myorders.module').then( m => m.MyordersPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountPageRoutingModule {}
