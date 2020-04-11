import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileSubscriptionPage } from './profile-subscription';

@NgModule({
  declarations: [
    ProfileSubscriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileSubscriptionPage),
  ],
})
export class ProfileSubscriptionPageModule {}
