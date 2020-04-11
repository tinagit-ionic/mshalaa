import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-day-news',
  templateUrl: 'day-news.html',
})
export class DayNewsPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any; 
  public dinvishesh: any; 
  public dinvisheshLength: any;
  public todayDate: String = new Date().toISOString();  
  public date: any;
  public currentDate: any;   

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
    this.date = moment().format('DD MMMM');
    
    // this.date = this.todayDate[0]+this.todayDate[1]+this.todayDate[2]+this.todayDate[3] + this.todayDate[4] + this.todayDate[5]+this.todayDate[6] + this.todayDate[7] + this.todayDate[8]+this.todayDate[9];    
    // this.currentDate = this.date;

  }

  addDate(currentDate) {
    console.log("right");
    this.date = moment(currentDate, 'DD MMMM').add(1, 'days').format('DD MMMM');
    this.dayNewsDetails();
  };

  rmDate(currentDate) {
    console.log("left");    
    this.date = moment(currentDate, 'DD MMMM').subtract(1, 'days').format('DD MMMM');
    this.dayNewsDetails();    
  };

  alarm() {
    let prompt = this.alertCtrl.create({
      title: 'Enter Date',
      message: "Enter date to get task details.",
      inputs: [
        {
          name: 'date',
          placeholder: 'Date',
          type: 'date',
          
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Show',
          handler: data => {

            console.log('date '+ data.date);

            if(data.date) {

            const loading = this.loadingCtrl.create({ content: 'Loading ...'});
            loading.present();
            setTimeout(() => {
              loading.dismiss();
            }, 3000);

            let post_data = { 'api_url': 'getDinvishesh', "post": { "date": data.date } };
            this.crudHttpProvider.callToCrudPost(post_data)
              .then(data => {

                let res = data;
                if (res['status'] == 100) {
                  
                  this.dinvishesh = res['data'].dinveshesh;
                  this.dinvisheshLength = this.dinvishesh.length;
                  this.date       = res['data'].daydate;
                  
                } else {

                  let toast = this.toastCtrl.create({
                    message: 'Data Inadequate',
                    duration: 3000
                  });
                  toast.present();
                }
              });
            } else{

              let toast = this.toastCtrl.create({
                message: 'Enter date',
                duration: 3000
              });
              toast.present();
            }

          }
        }
      ]
    });
    prompt.present();
  }

  dayNewsDetails() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);

    let post_data = { 'api_url': 'getDinvishesh', "post": { "date": this.date } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
          this.dinvishesh = res['data'].dinveshesh;
          this.dinvisheshLength = this.dinvishesh.length;
          // this.date       = res['data'].daydate;
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

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
    console.log('ionViewDidLoad DayNewsPage');
  }

}
