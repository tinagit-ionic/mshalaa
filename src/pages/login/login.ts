import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController, ToastController, ViewController, Events, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { HomePage } from '../home/home';
// import { SMS } from '@ionic-native/sms';
// import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

declare var window: any;
declare var SMS:any;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public myForm: FormGroup;  
  public mobile: any;
  public db_name: any;
  public url_play_store: any;
  public buttonDisabled: any;

  public userinfo:any;
  public stored_mb:any;

  public simInfo: any;
  public cards: any;
  public phoneNumber: any;

  isApp: boolean;
  masks: any;
  
  text = {
    "number": "", 
    "message": "",
  };

  countNewSMSs = 0;

  public id: any;
  public fullname: any;
  public mobile1: any;
  public mobile2: any;
  public dob: any;
  public city: any;
  public otp: any;
  public status: any;
  public gender: any;
  public photo: any;
  public latitude: any;
  public longitude: any;

  public device_id: any;
  public fcm_id: any;
  public app_version: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public alertCtrl: AlertController, public platform: Platform, public network: Network, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public crudHttpProvider: CrudHttpProvider, public sqlite: SQLite, public viewCtrl: ViewController, public smsService: SmsServiceProvider, public events: Events, public menuCtrl: MenuController, public geolocation: Geolocation, public device: Device, public push: Push) {

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
    this.url_play_store = ConstantVariable.url_play_store;
    this.app_version = ConstantVariable.app_version;    

    this.databaseCreate();

    this.myForm = this.formBuilder.group({
      'mobile': ['', [Validators.required]],
    });

    this.masks = {
      phoneNumber: ['(', '+', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
      cardNumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
      cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
      orderCode: [/[a-zA-z]/, ':', /\d/, /\d/, /\d/, /\d/]
    };
	  this.isApp = (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080'));
	  if (this.isApp) {
      this.smsService.waitingForSMS()
      .then(sms => {
        this.countNewSMSs += 1;
      })
	  }
	  else {
		  console.log("Web Browser.");
		  this.showAlert();
    }
    
    this.pushsetup();
    this.device_id = this.device.uuid;     

    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude  = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
       console.log('Error getting location', error);
    });

  }

  databaseCreate() {

    this.sqlite.create({
      name: this.db_name,
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('CREATE TABLE IF NOT EXISTS userLogin(rowid INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT, fullname TEXT, mobile1 TEXT, dob TEXT, city TEXT, gender TEXT, photo TEXT)', {})
      .then(data => console.log('Executed SQL'))
      .catch(e => console.log(e));
      
    }).catch(e => console.log(e));

  }

  pushsetup() {
    const options: PushOptions = {
      android: {
          senderID: '111345125461'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'true'
      },
      windows: {}
    };
 
    const pushObject: PushObject = this.push.init(options);
 
    pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let youralert = this.alertCtrl.create({
          title: 'Notification',
          message: notification.message
        });
        youralert.present();
      }
    });
 
    pushObject.on('registration').subscribe((registration: any) => {
      this.fcm_id = registration.registrationId;
    });
  
    pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: 'To test the APP use a mobile device.',
      buttons: ['OK']
    });
    alert.present();
  }

  sendTextMessage() {
    // Using nativa ionic SMS.
    //this.smsService.sendTextMessage(this.text.number, this.text.message);
    // Using cordova-sms-plugin.
    this.smsService.sendSMS(this.text.number, this.text.message);
  }

  onClickSMSList() {
    //console.log("onClickSMSList");
    this.countNewSMSs = 0;
    this.navCtrl.push("RegisterPage");
  }

  onChangePhone() {
    console.log(this.text.number);
  }

  onClickMessage() {
    //console.log("onClickMessage");
    this.text.number = this.text.number.replace("_", "");
    //console.log(this.text.number);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  isValid(field: string) {
    let formField = this.myForm.get(field);
    return formField.valid || formField.pristine;
  }

  login() {
    
    this.checkNetwork();
    const loading = this.loadingCtrl.create({ content: 'Login ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 4000);

    if(this.mobile){
    let post_data = { 'api_url': 'checkMemberMobile', "post": {'mobile': this.mobile, 'app_version': this.app_version, 'latitude': this.latitude, 'longitude': this.longitude, "fcm_id": this.fcm_id, "device_id" : this.device_id } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
          this.id       = res['data'].id;
          this.fullname = res['data'].fullname;
          this.mobile1  = res['data'].mobile;
          this.mobile2  = res['data'].mobile2;
          this.dob      = res['data'].dob;
          this.city     = res['data'].city;
          this.gender   = res['data'].gender;
          this.otp      = res['data'].otp;
          this.photo    = res['data'].photo;

          this.navCtrl.push('RegisterPage', {
            "id":       this.id,
            "fullname": this.fullname,
            "mobile1":  this.mobile1, 
            "mobile2":  this.mobile2, 
            "dob":      this.dob, 
            "city":     this.city, 
            "gender":   this.gender,
            "otp":      this.otp,
            "photo":    this.photo                                                                
          });
          this.viewCtrl.dismiss();
        
        } else if(res['status'] == 102) {
          
          let alert = this.alertCtrl.create({
            title: 'Update App',
            message: 'You have older version. Update your App.',
            buttons: [
              {
                text: 'Update Now',
                handler: () => {
                  window.open(this.url_play_store, '_system', 'location=yes');
                }
              }
            ],
            enableBackdropDismiss: false
          });
          alert.present();

        } else if(res['status'] == 103) {

          this.id      = res['data'].id;          
          this.mobile1 = res['data'].mobile;
          this.otp     = res['data'].otp;
          this.status  = res['data'].status;          

          this.navCtrl.push('RegisterPage',{
            "mobile1":  this.mobile1, 
            "otp":      this.otp,
            "id":       this.id                                                             
          });
          this.viewCtrl.dismiss();

        } else {

          let toast = this.toastCtrl.create({
            message: 'Invalid mobile number',
            duration: 3000,
            cssClass: "noNetworkToast"
          });
          toast.present();
        }
      });
    } else {

      let toast = this.toastCtrl.create({
        message: 'Enter mobile number',
        duration: 3000
      });
      toast.present();
    }
    
  }

  checkNetwork() {
    
    this.network.onDisconnect().subscribe(() => {

      this.buttonDisabled = true;

      let toast = this.toastCtrl.create({
        message: "Can't reach the server.",
        duration: 10000,
        cssClass: "noNetworkToast"
      });
      toast.present();

    }); 

  }

  ionViewDidEnter() {
    // the root left menu should be disabled on this page
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menuCtrl.enable(true);
  }

}
