import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileInviteListPage } from './profile-invite-list';

@NgModule({
  declarations: [
    ProfileInviteListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileInviteListPage),
  ],
})
export class ProfileInviteListPageModule {}
