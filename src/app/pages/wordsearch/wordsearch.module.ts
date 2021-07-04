import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WordsearchPageRoutingModule } from './wordsearch-routing.module';

import { WordsearchPage } from './wordsearch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WordsearchPageRoutingModule
  ],
  declarations: [WordsearchPage]
})
export class WordsearchPageModule {}
