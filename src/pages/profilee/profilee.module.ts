import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileePage } from './profilee';

@NgModule({
  declarations: [
    ProfileePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileePage),
  ],
})
export class ProfileePageModule {}
