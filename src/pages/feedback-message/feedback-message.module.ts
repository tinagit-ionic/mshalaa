import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedbackMessagePage } from './feedback-message';

@NgModule({
  declarations: [
    FeedbackMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(FeedbackMessagePage),
  ],
})
export class FeedbackMessagePageModule {}
