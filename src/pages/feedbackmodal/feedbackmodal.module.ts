import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackmodalPage } from './feedbackmodal';

@NgModule({
  declarations: [
    FeedbackmodalPage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackmodalPage),
  ],
  exports: [
    FeedbackmodalPage
  ]
})
export class FeedbackmodalPageModule {}
