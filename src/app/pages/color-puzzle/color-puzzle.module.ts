import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorPuzzlePageRoutingModule } from './color-puzzle-routing.module';

import { ColorPuzzlePage } from './color-puzzle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorPuzzlePageRoutingModule
  ],
  declarations: [ColorPuzzlePage]
})
export class ColorPuzzlePageModule {}
