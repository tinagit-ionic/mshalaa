import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentAffairPage } from './current-affair';

@NgModule({
  declarations: [
    CurrentAffairPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentAffairPage),
  ],
})
export class CurrentAffairPageModule {}
