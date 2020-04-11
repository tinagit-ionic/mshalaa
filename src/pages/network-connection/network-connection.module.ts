import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NetworkConnectionPage } from './network-connection';

@NgModule({
  declarations: [
    NetworkConnectionPage,
  ],
  imports: [
    IonicPageModule.forChild(NetworkConnectionPage),
  ],
})
export class NetworkConnectionPageModule {}
