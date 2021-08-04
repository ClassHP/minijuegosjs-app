import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SudokuPage } from './sudoku.page';

const routes: Routes = [
  {
    path: '',
    component: SudokuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SudokuPageRoutingModule {}
