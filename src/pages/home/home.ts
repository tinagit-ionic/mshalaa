import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { Storage } from '@ionic/storage';
import { SettingsProvider } from './../../providers/settings/settings';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pages: Array<{image: string, title: string, component: any}>;  
  public curHr: any;
  public dataDashboard: any;
  public db_name: any;
  public userinfo: any;
  public id: any;
  public mobile1: any;
  public fullname: any;
  public photo: any;
  public selectedTheme: String; 
  public colorTheme: String = 'teal-theme'; 

  constructor(public navCtrl: NavController, public platform: Platform, public alertCtrl: AlertController, public sqlite: SQLite, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public crudHttpProvider: CrudHttpProvider, public storage: Storage, public menuCtrl: MenuController, public settings: SettingsProvider, public appCtrl: App) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {

        let alert = this.alertCtrl.create({
          title: 'Exit',
          message: 'Do you want to Exit?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                alert =null;
              }
            },
            {
              text: 'Yes',
              handler: () => {
                navigator['app'].exitApp(); 
              }
            }
          ]
        });
        alert.present();
                    
      });
    });

    this.db_name = ConstantVariable.db_name;        

    this.sqlite.create({
      name: this.db_name,
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM userLogin', {})
      .then(data => {
        
        if(data.rows.length){
          this.userinfo = data.rows.item(0);     
          this.id       = this.userinfo.id;
          this.mobile1  = this.userinfo.mobile1;
          this.fullname = this.userinfo.fullname;
          this.photo = this.userinfo.photo;          
         
          this.getDashboardData();
          this.getDayStart();
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val); 
    this.getTheme();  

    let today = new Date()
    let curHr = today.getHours()

    if (curHr < 12) {
      console.log('good morning');
      this.curHr = "Good Morning";
    } else if (curHr < 18) {
      console.log('good Afternoon');
      this.curHr = "Good Afternoon";
    } else {
      console.log('good evening');
      this.curHr = "Good Evening";
    }  

  }

  getTheme() {

    this.storage.get('colortheme').then(theme=>{
      console.log('theme: '+ theme);
      if(theme == null){

        this.settings.setActiveTheme('light-theme');
        this.storage.set('colortheme','light-theme');

      }
    });

  }

  getDayStart() {

    let post_data = { 'api_url': 'memberDayFirstLogin', "post": { "mobile": this.mobile1 } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

  }

  getDashboardData() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getDashboardContents', "post": { 'id': this.id } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
          this.dataDashboard = res['data'];
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

  }

  goToSubject(subjectId) {

    this.navCtrl.push('SubjectPage',{
      "subjectId": subjectId
    });

  }

  goToPage(page) {
    this.navCtrl.push(page);
  }

  openMenu() {
    this.menuCtrl.open();
  }

}
