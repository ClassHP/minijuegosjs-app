import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BurroPageRoutingModule } from './burro-routing.module';

import { BurroPage } from './burro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BurroPageRoutingModule
  ],
  declarations: [BurroPage]
})
export class BurroPageModule {}
