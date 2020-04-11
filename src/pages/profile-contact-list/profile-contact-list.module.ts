import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileContactListPage } from './profile-contact-list';

@NgModule({
  declarations: [
    ProfileContactListPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileContactListPage),
  ],
})
export class ProfileContactListPageModule {}
