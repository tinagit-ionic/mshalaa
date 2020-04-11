import { Component, ViewChild } from '@angular/core';
import { AlertController, Platform, MenuController, Nav, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConstantVariable } from './constant-variable';
import { AppState } from './global.setting';
import { Subject } from 'rxjs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {Observable} from 'rxjs/Rx';
import { CrudHttpProvider } from '../providers/crud-http/crud-http';
import { Network } from '@ionic-native/network';
import { AndroidPermissions} from '@ionic-native/android-permissions';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { HomePage } from '../pages/home/home';
import { SettingsProvider } from '../providers/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = 'StartPage';
  // pages:any[];
  netStatus:any;
  activePage = new Subject();
  selectedTheme: String;
  public pages: Array<{image: string, title: string, component: any}>;    

  public db_name: any;
  public userinfo: any;
  public fullname: any;
  public photo: any;
  public mobile1: any;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public global: AppState,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public sqlite: SQLite,
    public crudHttpProvider: CrudHttpProvider, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public network: Network,
    public androidPermissions: AndroidPermissions,
    public push: Push,
    public settings: SettingsProvider,
    
   ) {

      this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

      this.initializeApp();

      // let connectSubscription = this.network.onConnect().subscribe(() => {
      //   console.log('network connected');
      //   this.netStatus = true;             
      // });

      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        console.log('network was disconnected');
        this.netStatus = false;      
        this.nav.setRoot('NetworkConnectionPage'); 
      });

      this.pages = [
        { image: 'assets/img/home.png', title: 'मुख्यपान', component: HomePage },
        { image: 'assets/img/book.png', title: 'चालू घडामोडी', component: 'CurrentAffairPage' },
        { image: 'assets/img/chat.png', title: 'सुविचार', component: 'ThoughtPage' },
        { image: 'assets/img/about.png', title: 'दिनविशेष', component: 'DayNewsPage' },
        { image: 'assets/img/people.png', title: 'चर्चा मंच', component: 'DiscussionListPage' },
        { image: 'assets/img/user_message.png', title: 'अभिप्राय', component: 'FeedbackPage' },
        { image: 'assets/img/contact.png', title: 'FAQ', component: 'FaqPage' },
        { image: 'assets/img/status.png', title: 'Live Feed', component: 'FeedListPage' }
        // { image: 'assets/img/user_message.png', title: 'Store', component: 'PaymentGatewayPage' }                  
      ];

      this.db_name = ConstantVariable.db_name; 

      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then((db: SQLiteObject) => {
  
        db.executeSql('SELECT * FROM userLogin', {})
        .then(data => {
          
          if(data.rows.length) {
            this.userinfo = data.rows.item(0);    
            this.fullname = this.userinfo.fullname;
            this.photo = this.userinfo.photo;    
            this.mobile1  = this.userinfo.mobile1;      
          }
  
        }).catch(e => console.log(e));
      }).catch(e => console.log(e));
  
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.global.set('theme', '');
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      let isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
	    if (isApp) this.requestSMSPermissions();
    
    });
  }

  // openPage(pages) {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   // navigate to the new page if it is not the current page
  //   this.nav.setRoot(pages.page);
  //   this.activePage.next(pages);
  // }

  requestSMSPermissions(){
    this .androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS)
    .then( success => console.log ( 'Permiso concebido.' ), 
    err => this.androidPermissions.requestPermission( this.androidPermissions.PERMISSION.READ_SMS) 
    ); 

    this.androidPermissions.requestPermissions ([ this.androidPermissions.PERMISSION.READ_SMS]);
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
    // this.activePage.next(page);
  }

  openMenu() {
    this.menu.open();
  }

}