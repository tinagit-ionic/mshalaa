import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscussionListPage } from './discussion-list';

@NgModule({
  declarations: [
    DiscussionListPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscussionListPage),
  ],
})
export class DiscussionListPageModule {}
