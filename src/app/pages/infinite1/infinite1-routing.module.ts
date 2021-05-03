import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Infinite1Page } from './infinite1.page';

const routes: Routes = [
  {
    path: '',
    component: Infinite1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Infinite1PageRoutingModule {}
