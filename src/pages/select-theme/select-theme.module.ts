import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectThemePage } from './select-theme';

@NgModule({
  declarations: [
    SelectThemePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectThemePage),
  ],
})
export class SelectThemePageModule {}
