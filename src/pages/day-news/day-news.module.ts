import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayNewsPage } from './day-news';

@NgModule({
  declarations: [
    DayNewsPage,
  ],
  imports: [
    IonicPageModule.forChild(DayNewsPage),
  ],
})
export class DayNewsPageModule {}
