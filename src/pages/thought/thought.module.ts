import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThoughtPage } from './thought';

@NgModule({
  declarations: [
    ThoughtPage,
  ],
  imports: [
    IonicPageModule.forChild(ThoughtPage),
  ],
})
export class ThoughtPageModule {}
