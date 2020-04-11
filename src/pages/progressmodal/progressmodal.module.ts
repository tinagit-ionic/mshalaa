import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressmodalPage } from './progressmodal';

@NgModule({
  declarations: [
    ProgressmodalPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgressmodalPage),
  ],
  exports: [
    ProgressmodalPage
  ]
})
export class ProgressmodalPageModule {}
