import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JigsawPageRoutingModule } from './jigsaw-routing.module';

import { JigsawPage } from './jigsaw.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JigsawPageRoutingModule
  ],
  declarations: [JigsawPage]
})
export class JigsawPageModule {}
