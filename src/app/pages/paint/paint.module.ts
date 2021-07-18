import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaintPageRoutingModule } from './paint-routing.module';

import { PaintPage } from './paint.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaintPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PaintPage]
})
export class PaintPageModule {}
