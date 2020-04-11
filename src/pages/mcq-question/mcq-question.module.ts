import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { McqQuestionPage } from './mcq-question';

@NgModule({
  declarations: [
    McqQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(McqQuestionPage),
  ],
})
export class McqQuestionPageModule {}
