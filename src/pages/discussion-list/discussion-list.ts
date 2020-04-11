import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController, ModalController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-discussion-list',
  templateUrl: 'discussion-list.html',
})
export class DiscussionListPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;  
  public discussionlist: any;
  public discussionlistLength: any;
  public isToggled: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public menuCtrl: MenuController, public modalCtrl: ModalController) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

    this.isToggled = false;

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

    this.discussionList("");            

  }

  notify() {
    console.log("Toggled: "+ this.isToggled); 

    if(this.isToggled == false){
      console.log("all");

      this.discussionList("");
    } else {
      console.log("my post");   
      this.discussionList(this.id)   
    }

  }

  discussionList(member_id) {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getDiscussionList', "post": { "member_id": member_id  } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.discussionlist = res['data']; 
          this.discussionlistLength = this.discussionlist.length;
      
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
  }

  postQuestion(){
    // const visit = this.modalCtrl.create('FeedbackmodalPage');
    // visit.present();

    this.navCtrl.push('FeedbackmodalPage');
    
  }

  goToDiscussion(did){
    this.navCtrl.push('DiscussionPage',{
      "did": did
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
  
  goToBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscussionListPage');
  }

}
