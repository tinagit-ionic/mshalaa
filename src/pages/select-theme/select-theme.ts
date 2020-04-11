import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import moment from 'moment';
import { SettingsProvider } from './../../providers/settings/settings';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-select-theme',
  templateUrl: 'select-theme.html',
})
export class SelectThemePage {

  public selectedTheme: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public menuCtrl: MenuController, public settings: SettingsProvider, public storage: Storage) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  blueColorAppTheme(){
    this.settings.setActiveTheme('light-theme');
    this.storage.set('colortheme','light-theme');
  }

  redColorAppTheme(){
    this.settings.setActiveTheme('dark-theme');
    this.storage.set('colortheme','dark-theme');    
  }

  amberColorAppTheme(){
    this.settings.setActiveTheme('amber-theme');
    this.storage.set('colortheme','amber-theme');
  }

  orangeColorAppTheme(){
    this.settings.setActiveTheme('orange-theme');
    this.storage.set('colortheme','orange-theme');
  }

  greenColorAppTheme(){
    this.settings.setActiveTheme('green-theme');
    this.storage.set('colortheme','green-theme');
  }

  indigoColorAppTheme(){
    this.settings.setActiveTheme('indigo-theme');
    this.storage.set('colortheme','indigo-theme');
  }

  pinkColorAppTheme(){
    this.settings.setActiveTheme('pink-theme');
    this.storage.set('colortheme','pink-theme');
  }

  tealColorAppTheme(){
    this.settings.setActiveTheme('teal-theme');
    this.storage.set('colortheme','teal-theme');
  }

  violetColorAppTheme(){
    this.settings.setActiveTheme('violet-theme');
    this.storage.set('colortheme','violet-theme');
  }

  notification(){
    this.navCtrl.push('NotificationPage');
  }

  profile() {
    this.navCtrl.push('ProfilePage');
  }

  openMenu() {
    this.menuCtrl.open();
  }
  
  goToBack() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectThemePage');
  }

}
