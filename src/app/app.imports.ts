//Used for setting
import { ConstantVariable } from './constant-variable';

//Used for Theming
import { AppState } from './global.setting';

//MODULE
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { TextMaskModule } from 'angular2-text-mask';

//PROVIDER
import { CrudHttpProvider } from '../providers/crud-http/crud-http';
import { SmsServiceProvider } from '../providers/sms-service/sms-service';
import { SettingsProvider } from '../providers/settings/settings';

//NATIVE
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
// import { NativeAppRatePage } from '../pages/native-app-rate/native-app-rate';
import { Network } from '@ionic-native/network';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SMS } from '@ionic-native/sms';
import { AndroidPermissions} from '@ionic-native/android-permissions';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';

//PAGES
import { HomePage } from '../pages/home/home';
import { HomeePage } from '../pages/homee/homee';

export const MODULES = [
    BrowserModule,
    HttpModule,
    TextMaskModule,
    IonicStorageModule.forRoot(),
];

export const PROVIDERS = [
    CrudHttpProvider,
    AppState,
    SmsServiceProvider,
    SettingsProvider
];

export const NATIVES = [
    SplashScreen,
    StatusBar,
    Network,
    SQLite,
    SMS,
    AndroidPermissions,
    Push,
    SocialSharing,
    Contacts,
    CallNumber,
    Camera,
    File,
    FileTransfer,
    Geolocation,
    Device,
    InAppBrowser
];

export const PAGES = [
    HomePage,
    HomeePage
];

