import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicTacToePage } from './tic-tac-toe.page';

const routes: Routes = [
  {
    path: '',
    component: TicTacToePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicTacToePageRoutingModule {}
