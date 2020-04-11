import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileExamEditPage } from './profile-exam-edit';

@NgModule({
  declarations: [
    ProfileExamEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileExamEditPage),
  ],
})
export class ProfileExamEditPageModule {}
