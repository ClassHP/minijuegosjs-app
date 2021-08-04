import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SudokuPageRoutingModule } from './sudoku-routing.module';

import { SudokuPage } from './sudoku.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SudokuPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SudokuPage]
})
export class SudokuPageModule {}
