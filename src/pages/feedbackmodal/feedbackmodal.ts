import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController, ViewController, Platform, AlertController, App, LoadingController, MenuController } from 'ionic-angular';
import { ConstantVariable } from '../../app/constant-variable';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-feedbackmodal',
  templateUrl: 'feedbackmodal.html',
})
export class FeedbackmodalPage {

  public myForm: FormGroup;   
  public message: any;

  public db_name: any;
  public userinfo: any;
  public id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public sqlite: SQLite, public platform: Platform, public menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

    this.myForm = this.formBuilder.group({   
      'message': ['', []]
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
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

  }

  userInfo: {message: string } = {message: ''}; 
  
  postQuestion(){
    console.log("message "+this.userInfo.message);

    if(this.userInfo.message){

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'insertDiscussion', "post": { 'id': this.id, "discusstext": this.userInfo.message } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          let toast = this.toastCtrl.create({
            message: 'Your Question is posted',
            duration: 3000
          });
          toast.present();

          this.navCtrl.push("DiscussionListPage");
          this.viewCtrl.dismiss();
      
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
        message: 'Ask question',
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

  openMenu() {
    this.menuCtrl.open();
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackmodalPage');
  }

}