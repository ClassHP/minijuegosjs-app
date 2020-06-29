import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimbirichePage } from './timbiriche.page';

const routes: Routes = [
  {
    path: '',
    component: TimbirichePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimbirichePageRoutingModule {}
