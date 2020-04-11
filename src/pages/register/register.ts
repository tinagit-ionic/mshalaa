import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ToastController, ViewController, Events, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { ConstantVariable } from '../../app/constant-variable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Http, Headers } from '@angular/http';
import { SmsServiceProvider } from '../../providers/sms-service/sms-service';
declare var SMS:any;

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  public myForm: FormGroup;  
  public otpDigit1:any;
  public otpDigit2:any;
  public otpDigit3:any;
  public otpDigit4:any;
  public db_name: any;

  public otp_user: any;
  public smses:any;
  public smsArived: any;

  public simInfo: any;
  public cards: any;
  public phoneNumber: any;
  public pn: any;

  public messages: any;
  public results: any;
  public message1: any;

  public id: any;
  public fullname: any;
  public mobile1: any;
  public mobile2: any;
  public dob: any;
  public city: any;
  public gender: any;
  public otp: any;
  public photo: any;
  public deviceOtp: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public platform: Platform, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public crudHttpProvider: CrudHttpProvider, public toastCtrl: ToastController, public sqlite: SQLite, public viewCtrl: ViewController, public androidPermissions: AndroidPermissions, public http:Http, public smsService: SmsServiceProvider, public events: Events, public menuCtrl: MenuController) {

    this.db_name = ConstantVariable.db_name;

    this.id       = navParams.get("id");
    this.fullname = navParams.get("fullname");
    this.mobile1  = navParams.get("mobile1");
    this.mobile2  = navParams.get("mobile2");  
    this.dob      = navParams.get("dob");
    this.city     = navParams.get("city");
    this.gender   = navParams.get("gender");      
    this.otp      = navParams.get("otp"); 
    this.photo    = navParams.get("photo");     

    // let toast = this.toastCtrl.create({
    //   message: "OTP " +this.otp,
    //   duration: 3000
    // });
    // toast.present();

    this.myForm = this.formBuilder.group({
      'otpDigit1': ['', [Validators.required]],
      'otpDigit2': ['', [Validators.required]],
      'otpDigit3': ['', [Validators.required]],
      'otpDigit4': ['', [Validators.required]]            
    });

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

  }

  isValid(field: string) {
    let formField = this.myForm.get(field);
    return formField.valid || formField.pristine;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  ionViewDidEnter() {

    this.menuCtrl.enable(false);

    this.platform.ready().then((readySource) => {
      if(SMS) SMS.startWatch(()=>{
              console.log('watching started');

              // let toast = this.toastCtrl.create({
              //   message: "watching started",
              //   duration: 3000
              // });
              // toast.present();

            }, Error=>{

              console.log('failed to start watching');

              //  let toast = this.toastCtrl.create({
              //   message: "failed to start watching",
              //   duration: 3000
              // });
              // toast.present();

      });

      document.addEventListener('onSMSArrive', (e:any)=>{
          var sms = e.data;
          console.log(sms);

          // let toast = this.toastCtrl.create({
          //   message: "sms "+JSON.stringify(sms),
          //   duration: 3000
          // });
          // toast.present();

          this.otpDigit1 = sms.body[5];
          this.otpDigit2 = sms.body[6];
          this.otpDigit3 = sms.body[7];
          this.otpDigit4 = sms.body[8];

          this.deviceOtp = sms.body[5] + sms.body[6] + sms.body[7] + sms.body[8];

          this.otpRegister();

          // let alert = this.alertCtrl.create({
          //   title: 'Remember OTP',
          //   message: this.deviceOtp,
          //   buttons: [
          //     {
          //       text: 'OK',
          //       handler: () => {
                   
          //       }
          //     }
          //   ]
          // });
          // alert.present();

      });
    });
  }


  next(el) {
    el.setFocus();
  }

  otpRegister() {
    
    const loading = this.loadingCtrl.create({ content: 'Login ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);

    this.otp_user = this.otpDigit1 + this.otpDigit2 + this.otpDigit3 + this.otpDigit4;    

    if(this.otp_user == this.otp && this.fullname) {   
      console.log("fullname "+this.fullname);

      this.sqlite.create({
        name: this.db_name,
        location: 'default'
      }).then((db: SQLiteObject) => {

        db.executeSql('SELECT * FROM userLogin', {})
        .then(data => {
  
          if(data.rows.length == 0){
            
            db.executeSql('CREATE TABLE IF NOT EXISTS userLogin(rowid INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT, fullname TEXT, mobile1 TEXT, dob TEXT, city TEXT, gender TEXT, photo TEXT)', {})
            .then(data => console.log('Executed SQL'))
            .catch(e => console.log(e));

            db.executeSql('INSERT INTO userLogin VALUES(NULL,?,?,?,?,?,?,?)',[this.id, this.fullname, this.mobile1, this.dob, this.city, this.gender, this.photo])
              .then(data => { 
                
                this.navCtrl.push(HomePage);
                this.viewCtrl.dismiss(); 

            }).catch(e => { console.log(e); });
            
          } else {

            let toast = this.toastCtrl.create({
              message: "Something went wrong",
              duration: 3000
            });
            toast.present();

          }

        }).catch(e => console.log(e));
      }).catch(e => { console.log(e); }); 

    } else if(this.otp_user == this.otp && !this.fullname) {
      console.log("id "+this.id);            

      this.navCtrl.push('LoginSetupPage', {
        "id": this.id,
        "mobile1": this.mobile1
      });
      this.viewCtrl.dismiss(); 

    } else {

      // this.sqlite.create({
      //   name: this.db_name,
      //   location: 'default'
      // }).then((db: SQLiteObject) => {

      //   db.executeSql('DROP TABLE userLogin', {})
      //   .then(data => {
          
      //     db.executeSql('CREATE TABLE IF NOT EXISTS userLogin(rowid INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT, fullname TEXT, mobile1 TEXT, dob TEXT, city TEXT, gender TEXT, photo TEXT)', {})
      //     .then(data => console.log('Executed SQL'))
      //     .catch(e => console.log(e));
        
      //   }).catch(e => console.log(e));
      // }).catch(e => console.log(e));

      let toast = this.toastCtrl.create({
        message: "Invalid OTP",
        duration: 3000
      });
      toast.present();

    }
    
  }

  resendOtp() {
    
    const loading = this.loadingCtrl.create({ content: 'Login ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 4000);

    let post_data = { 'api_url': 'resendOTP', "post": { 'mobile': this.mobile1, "otp": this.otp } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
          this.ionViewDidEnter();

          this.otp = res['data'].otp;          

          let toast = this.toastCtrl.create({
            message: "OTP " +this.otp,
            duration: 3000
          });
          toast.present();
        
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menuCtrl.enable(true);
  }

}