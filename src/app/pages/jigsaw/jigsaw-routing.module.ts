import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JigsawPage } from './jigsaw.page';

const routes: Routes = [
  {
    path: '',
    component: JigsawPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JigsawPageRoutingModule {}
