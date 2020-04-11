import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, ModalController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import underscore from 'underscore';

@IonicPage()
@Component({
  selector: 'page-review-level',
  templateUrl: 'review-level.html',
})

export class ReviewLevelPage {
  
  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;

  public level_id: any;
  public subject_id: any; 
  public questionList: any;

  public questionId: any;
  public question: any;
  public optionA: any;
  public optionB: any;
  public optionC: any;
  public optionD: any;
  public queInfoZero: any;
  public questionCount: any;
  public i: any = 1;
  public qnum: any = 1;
  public user_ans: any;
  public num: number = 0;
  public currentIndex: number;
  public subjectName: any;
  public showSubmitBtn: any = false;
  public nextIndex: any;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public modalCtrl: ModalController, public menuCtrl: MenuController) {

    // this.platform.ready().then(() => {
    //   this.platform.registerBackButtonAction(() => {
    //       this.navCtrl.pop();               
    //   });
    // });

    let backAction =  platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    },2);

    this.db_name = ConstantVariable.db_name;  
    this.level_id = navParams.get("level_id");      
    this.subject_id = navParams.get("subject_id");
    this.subjectName = navParams.get("subjectName");

    this.sqlite.create({
      name: this.db_name,
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM userLogin', {})
      .then(data => {
        
        if(data.rows.length){
          this.userinfo = data.rows.item(0);     
          this.id       = this.userinfo.id;
          this.photo    = this.userinfo.photo;
          this.getReviewList();          
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));  

  }

  getReviewList() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'reviewCompletedLevel', "post": { "member_id": this.id, "subject_id": this.subject_id, "level_id": this.level_id } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.questionList = res['data'].result;
          this.getSingleQuestion(0);
        
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

  }

  getSingleQuestion(qlindex) {

      this.queInfoZero = this.questionList[qlindex]; 
      this.currentIndex = qlindex;

      if(this.questionCount > this.currentIndex) {
        this.nextIndex = (this.currentIndex + 1);  
      }

      this.questionId = this.queInfoZero.questionId;
      this.question = this.queInfoZero.question;
      this.optionA = this.queInfoZero.optionA;
      this.optionB = this.queInfoZero.optionB;
      this.optionC = this.queInfoZero.optionC;
      this.optionD = this.queInfoZero.optionD;  
    
  }

  goToBack() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewLevelPage');
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
