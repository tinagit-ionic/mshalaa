import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-current-affair',
  templateUrl: 'current-affair.html',
})
export class CurrentAffairPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;  

  public date: any;
  public dateCurr: any; 
  public curraffair: any;
  public curraffairLength: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public menuCtrl: MenuController) {

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

    this.dayNewsDetails();     
    this.date = moment().format('YYYY-MM-DD');

  }

  addDate(currentDate) {
    this.date = moment(currentDate, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
    this.dayNewsDetails();
  };

  rmDate(currentDate) {   
    this.date = moment(currentDate, 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
    this.dayNewsDetails();    
  };

  dayNewsDetails() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);

    let post_data = { 'api_url': 'getCurrentaffairs', "post": { "date": this.date } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
          this.curraffair = res['data'].curraffair;
          this.curraffairLength = this.curraffair.length;
          this.dateCurr = res['data'].dateReturn;
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

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
    console.log('ionViewDidLoad CurrentAffairPage');
  }

}
