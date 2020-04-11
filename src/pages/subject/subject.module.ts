import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubjectPage } from './subject';

@NgModule({
  declarations: [
    SubjectPage,
  ],
  imports: [
    IonicPageModule.forChild(SubjectPage),
  ],
})
export class SubjectPageModule {}
