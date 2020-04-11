import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController, ViewController, MenuController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { HomePage } from '../home/home';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@IonicPage()
@Component({
  selector: 'page-login-setup',
  templateUrl: 'login-setup.html',
})
export class LoginSetupPage {

  public myForm: FormGroup; 

  public ufullname: any;
  public umobile: any;
  public udob: any;
  public ucity: any;
  public id: any;
  public gender: any;
  public mobile1: any;
  public db_name: any;
  public photo: any;
  public latitude: any;
  public longitude: any;
  public fcm_id: any;
  public device_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public viewCtrl: ViewController, public menuCtrl: MenuController, public device: Device, public geolocation: Geolocation, public push: Push, public alertCtrl: AlertController) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });   
    
    this.id = navParams.get("id");
    this.mobile1 = navParams.get("mobile1");
    this.db_name = ConstantVariable.db_name;
  
    this.myForm = this.formBuilder.group({
      'ufullname': ['', []],
      'umobile': ['', []],
      'gender': ['', []],      
      'udob': ['', []],
      'ucity': ['', []]
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude  = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
    }).catch((error) => {
       console.log('Error getting location', error);
    });

  }

  loginSetup(){

    if(this.ufullname && this.umobile && this.udob && this.ucity && this.gender){
      
      if(this.id) {

      const loading = this.loadingCtrl.create({ content: 'Loading ...'});
      loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 2000);

      let postParams = {
        "id":        this.id,
        "fullname":  this.ufullname,
        "mobile2":   this.umobile,
        "dob":       this.udob,
        "city":      this.ucity,
        "gender":    this.gender,
        "latitude":  this.latitude,
        "longitude": this.longitude
      };

      let post_data = { 'api_url': 'insertMemberInfo', "post": postParams };
      this.crudHttpProvider.callToCrudPost(post_data)
        .then(data => {

          let res = data;
          if (res['status'] == 100) {

            this.photo = res['data'].photo;

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
      
                  db.executeSql('INSERT INTO userLogin VALUES(NULL,?,?,?,?,?,?,?)',[this.id, this.ufullname, this.mobile1, this.udob, this.ucity, this.gender, this.photo])
                    .then(data => { 
                      
                      this.navCtrl.push(HomePage);
                      this.viewCtrl.dismiss(); 
      
                  }).catch(e => { console.log(e); });
                  
                }
      
              }).catch(e => console.log(e));
            }).catch(e => { console.log(e); });  
          
          } else {

            let toast = this.toastCtrl.create({
              message: 'Data Inadequate',
              duration: 3000
            });
            toast.present();
          }
        });
      } else {

        let toast = this.toastCtrl.create({
          message: 'Something went wrong',
          duration: 3000
        });
        toast.present();
      }

    } else {
      let toast = this.toastCtrl.create({
        message: 'Some fields are mandatory',
        duration: 3000
      });
      toast.present();
    } 
    
  }

  goToBack(){
    this.navCtrl.pop();
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginSetupPage');
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
