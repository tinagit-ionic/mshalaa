import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileInvitePage } from './profile-invite';

@NgModule({
  declarations: [
    ProfileInvitePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileInvitePage),
  ],
})
export class ProfileInvitePageModule {}
