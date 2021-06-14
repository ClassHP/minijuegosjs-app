import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrosswordsPage } from './crosswords.page';

const routes: Routes = [
  {
    path: '',
    component: CrosswordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrosswordsPageRoutingModule {}
