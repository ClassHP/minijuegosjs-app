import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicTacToePageRoutingModule } from './tic-tac-toe-routing.module';

import { TicTacToePage } from './tic-tac-toe.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicTacToePageRoutingModule
  ],
  declarations: [TicTacToePage]
})
export class TicTacToePageModule {}
