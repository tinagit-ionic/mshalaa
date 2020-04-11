import { SharedModule } from './shared.module';
import { ErrorHandler, NgModule, enableProdMode } from '@angular/core';  //enableProdMode : make development faster
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { MODULES, PROVIDERS, NATIVES, PAGES  } from './app.imports';
import { HomePage } from '../pages/home/home';

// this is the magic wand
enableProdMode();

@NgModule({
  declarations: [
    MyApp,
    PAGES
  ],
  imports: [
    MODULES,
    IonicModule.forRoot(MyApp,{
      menuType: 'push',
      platforms: {
        ios: {
          menuType: 'overlay',
        }
      }
    }),
    SharedModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PAGES
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PROVIDERS,
    NATIVES
  ]
})
export class AppModule {}