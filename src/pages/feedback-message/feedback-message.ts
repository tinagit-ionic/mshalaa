import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, ViewController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { Chart } from 'chart.js';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-feedback-message',
  templateUrl: 'feedback-message.html',
})
export class FeedbackMessagePage {

  public myForm: FormGroup; 
  public message: any;
  contactsfound = [];
  public contactone: any;
  public contacttwo: any;  
  contacttobefound:any;
  search: any;

  everybody;
  contact = [];
  groupedContacts = [];
  myGroupMember:any=[];

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public platform: Platform, public crudHttpProvider: CrudHttpProvider, public sqlite: SQLite, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public viewCtrl: ViewController, public menuCtrl:MenuController, public contacts: Contacts, public callNumber: CallNumber) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
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
          this.photo = this.userinfo.photo;          
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e)); 

    this.myForm = this.formBuilder.group({  
      'message': ['', [Validators.required]]
    });

  }

  goToHome() {
    this.navCtrl.push(HomePage);  
    this.viewCtrl.dismiss();  
  }

  notification() {
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
    console.log('ionViewDidLoad FeedbackMessagePage');
  }

}
