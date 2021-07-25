import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreecellPage } from './freecell.page';

const routes: Routes = [
  {
    path: '',
    component: FreecellPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolitairePageRoutingModule {}
