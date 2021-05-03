import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Infinite1PageRoutingModule } from './infinite1-routing.module';

import { Infinite1Page } from './infinite1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Infinite1PageRoutingModule
  ],
  declarations: [Infinite1Page]
})
export class Infinite1PageModule {}
