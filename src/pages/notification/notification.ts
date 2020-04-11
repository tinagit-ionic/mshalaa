import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  public notificationnList = [
    {
      "image":"assets/img/boy.png",
      "msg":"mpscshala replied  to your comment",
      "date":"27 Feb, 2018 at 12:15 pm"
    },
    {
      "image":"assets/img/calendar_two.png",
      "msg":"Your subscription ends in 7 days. Please renew to receive updates on app",
      "date":"27 Feb, 2018 at 12:15 pm"
    },
    {
      "image":"assets/img/gift_two.png",
      "msg":"Your invitation is accepted by Anjali Bodkhe. You won 2 coins.",
      "date":"27 Feb, 2018 at 12:15 pm"
    }
  ];

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;  
  public notificationListLength: any;
  public notificationList: any = [];

  public start: number = 0;
  public flag:any=true;
  public isBusy:any=false;

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
          this.getNotificationList();        
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));          

  }

  getNotificationList() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    this.start = 0;

    let post_data = { 'api_url': 'getMemberNotificationList', "post": { "member_id": this.id, "limit": this.start } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.notificationList = res['data']; 
          this.notificationListLength = this.notificationList.length;
          this.start += 10;
          this.loadData(this.start);
      
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
  }

  loadData(start) {

    this.isBusy = true;
    this.start = start;

    return new Promise(resolve => {
           
        let post_data = { 'api_url': 'getMemberNotificationList', "post": { "member_id": this.id, 'limit': this.start } };

        this.crudHttpProvider.callToCrudPost(post_data)
        .then(data => {

            let res = data;
            if (res['status'] == 100) {

              this.isBusy = false;
              this.start += 10;
              this.notificationList = this.notificationList.concat(res['data']);

              if(res['data'].length <= 10 ){
                this.flag = false;
                if(res['data'].length == 0){
                  this.flag = true;
                }
                console.log(res['data'].length + "  " + res['data']);
                console.log(this.flag);
              }
            }
            resolve(true);
          });

      });
  }

  updateNotification(NotifyId){
    
    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'updateMemberNotification', "post": { "NotifyId": NotifyId } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {        

          this.getNotificationList();

          let toast = this.toastCtrl.create({
            message: 'Seen',
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

  removeNotification(NotifyId) {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'deleteMemberNotification', "post": { "NotifyId": NotifyId } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.getNotificationList();

          let toast = this.toastCtrl.create({
            message: 'Deleted',
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

  readAll() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'updateMemberAllNotification', "post": { "member_id": this.id } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.getNotificationList();

          // let toast = this.toastCtrl.create({
          //   message: 'Seen all',
          //   duration: 3000
          // });
          // toast.present();
      
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
  }

  profile() {
    this.navCtrl.push('ProfilePage');
  }

  openMenu() {
    this.menuCtrl.open();
  }
  
  goToBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

}
