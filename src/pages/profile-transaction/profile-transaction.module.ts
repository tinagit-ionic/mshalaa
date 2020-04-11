import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileTransactionPage } from './profile-transaction';

@NgModule({
  declarations: [
    ProfileTransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileTransactionPage),
  ],
})
export class ProfileTransactionPageModule {}
