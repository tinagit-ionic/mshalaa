import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginSetupPage } from './login-setup';

@NgModule({
  declarations: [
    LoginSetupPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginSetupPage),
  ],
})
export class LoginSetupPageModule {}
