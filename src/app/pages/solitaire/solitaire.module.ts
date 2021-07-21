import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolitairePageRoutingModule } from './solitaire-routing.module';
import { SolitairePage } from './solitaire.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolitairePageRoutingModule,
    ComponentsModule
  ],
  declarations: [SolitairePage]
})
export class SolitairePageModule {}
