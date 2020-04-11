import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { InAppBrowser, InAppBrowserEvent } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-payment-gateway',
  templateUrl: 'payment-gateway.html',
})
export class PaymentGatewayPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any; 
  public surl: any = "https://www.payumoney.com/merchant-dashboard/#";
  public furl: any;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public menuCtrl: MenuController, public iab: InAppBrowser) {

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

    // const browser = this.iab.create(payString, "_self", {
    //   location: 'no',
    //   clearcache: 'yes',
    //   hardwareback: 'no',
    // });
    // browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
    //   if (event.url === this.surl) {
    //     this.paymentSuccess();
    //   } else if (event.url === this.furl) {
    //     this.paymentFailure();
    //   }
    // });



  }

  payment() {
    const browser = this.iab.create("www.payumoney.com", "_self", {
      location: 'no',
      clearcache: 'yes',
      hardwareback: 'no',
    });
    browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
      if (event.url === this.surl) {
        this.paymentSuccess();
      } else if (event.url === this.furl) {
        this.paymentFailure();
      }
    });
  }

  paymentSuccess() {
    console.log("success");
  }

  paymentFailure() {
    console.log("failure");
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
    console.log('ionViewDidLoad PaymentGatewayPage');
  }

}
