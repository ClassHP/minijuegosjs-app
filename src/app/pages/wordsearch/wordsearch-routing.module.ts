import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WordsearchPage } from './wordsearch.page';

const routes: Routes = [
  {
    path: '',
    component: WordsearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WordsearchPageRoutingModule {}
