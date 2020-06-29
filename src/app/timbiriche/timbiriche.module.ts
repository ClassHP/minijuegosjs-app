import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimbirichePageRoutingModule } from './timbiriche-routing.module';

import { TimbirichePage } from './timbiriche.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimbirichePageRoutingModule
  ],
  declarations: [TimbirichePage]
})
export class TimbirichePageModule {}
