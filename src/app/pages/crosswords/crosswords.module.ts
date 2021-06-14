import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrosswordsPageRoutingModule } from './crosswords-routing.module';

import { CrosswordsPage } from './crosswords.page';
import { WordDetailComponent } from './word-detail/word-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrosswordsPageRoutingModule
  ],
  declarations: [CrosswordsPage, WordDetailComponent]
})
export class CrosswordsPageModule {}
