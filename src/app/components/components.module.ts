import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FireworksComponent } from './fireworks/fireworks.component';

@NgModule({
  declarations: [
    FireworksComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FireworksComponent,
  ]
})
export class ComponentsModule { }
