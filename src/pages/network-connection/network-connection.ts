import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-network-connection',
  templateUrl: 'network-connection.html',
})
export class NetworkConnectionPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public network: Network ) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

  }

  retry() {

    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.viewCtrl.dismiss();
    }, (then) => {

      let toast = this.toastCtrl.create({
        message: 'RETRY',
        duration: 3000
      });
      toast.present();

    });

  }
  
  goToBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NetworkConnectionPage');
  }

}
