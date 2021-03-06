import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;  

  shownGroup = null;
  public faqlist: any = [];
  public faqlistLength: any;

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
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

    this.faq();

  }

  faq() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    this.start = 0;

    let post_data = { 'api_url': 'getFaqList', "post": { "limit": this.start } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.faqlist = res['data'];
          this.faqlistLength = this.faqlist.length;
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
           
        let post_data = { 'api_url': 'getFaqList', "post": { 'limit': this.start } };

        this.crudHttpProvider.callToCrudPost(post_data)
        .then(data => {

            let res = data;
            if (res['status'] == 100) {

              this.isBusy = false;
              this.start += 10;
              this.faqlist = this.faqlist.concat(res['data']);

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

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  notification() {
    this.navCtrl.push('NotificationPage');
  }

  profile() {
    this.navCtrl.push('ProfilePage');
  }

  openMenu(){
    this.menuCtrl.open();
  }
  
  goToBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
  }

}
