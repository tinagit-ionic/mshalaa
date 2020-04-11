import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-discussion',
  templateUrl: 'discussion.html',
})
export class DiscussionPage {

  public comment: any;
  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;  
  public did: any;

  public discussion: any;
  public comment_arr: any;

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

    this.did = navParams.get("did");
    this.discussionDetail();

  }

  discussionDetail(){

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getSinglediscussion', "post": { "id": this.did} };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.discussion = res['data'].discussion; 
          this.comment_arr = res['data'].comment_arr;           
      
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
  }

  postComment(){

    if(this.comment){
      const loading = this.loadingCtrl.create({ content: 'Loading ...'});
      loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 3000);

      let post_data = { 'api_url': 'insertComments', "post": { "dis_id": this.did, "mem_id": this.id, "comment": this.comment} };
      this.crudHttpProvider.callToCrudPost(post_data)
        .then(data => {

          let res = data;
          if (res['status'] == 100) {

            this.discussionDetail(); 
            
            let toast = this.toastCtrl.create({
              message: 'Comment posted',
              duration: 3000
            });
            toast.present();
            this.comment = "";
        
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
        message: 'Add comment',
        duration: 3000
      });
      toast.present();
    }
  }


  notification(){
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
    console.log('ionViewDidLoad DiscussionPage');
  }

}
