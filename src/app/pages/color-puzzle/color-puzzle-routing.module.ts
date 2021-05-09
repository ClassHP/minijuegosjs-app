import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorPuzzlePage } from './color-puzzle.page';

const routes: Routes = [
  {
    path: '',
    component: ColorPuzzlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorPuzzlePageRoutingModule {}
