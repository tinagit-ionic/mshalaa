import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;  

  public mcqOneBg: string = '2px; solid #ffffff';
  public mcqTwoBg: string = '2px; solid #ffffff';
  public mcqThreeBg: string = '2px; solid #ffffff'; 
  public mcqFourBg: string = '2px; solid #ffffff'; 

  public level_id: any;
  public subject_id: any; 
  public questionInfo: any;

  public questionId: any;
  public question: any;
  public optionA: any;
  public optionB: any;
  public optionC: any;
  public optionD: any;
  public queInfoZero: any;
  public questionCount: any;
  public i: any = 1;
  public qnum: any;
  public user_ans: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

    this.db_name = ConstantVariable.db_name; 
    this.level_id = navParams.get("level_id");      
    this.subject_id = navParams.get("subject_id");       

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
          this.getQuestionList();
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));   
    this.getQuestionList();
           
  }

  getQuestionList() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getQuestionsList', "post": { "member_id": 1, "subject_id": 5, "level_id": 4 } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.questionCount = res['data'].questionCount;
          this.questionInfo  = res['data'].questionInfo;
          this.queInfoZero = this.questionInfo[0].question; 
          // this.questionId = this.queInfoZero.questionId;
          // this.question = this.queInfoZero.question;
          // this.optionA = this.queInfoZero.optionA;
          // this.optionB = this.queInfoZero.optionB;
          // this.optionC = this.queInfoZero.optionC;
          // this.optionD = this.queInfoZero.optionD;          
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

  }

  goToQuestion(i, questionId, question, optionA, optionB, optionC, optionD){

    this.qnum = i;
    this.questionId = questionId;
    this.question = question;
    this.optionA = optionA;
    this.optionB = optionB;
    this.optionC = optionC;
    this.optionD = optionD;
    
  }

  mcqStatus(user_ans, border_a, border_b, border_c, border_d) {
    console.log("user ans  " +user_ans);
    // this.user_ans = user_ans;

    this.mcqOneBg = '2px solid ' + border_a;
    this.mcqTwoBg = '2px solid ' + border_b;
    this.mcqThreeBg = '2px solid ' + border_c;
    this.mcqFourBg = '2px solid ' + border_d;

    // const visit = this.modalCtrl.create('ProgressmodalPage');
    // visit.present();
    // this.navCtrl.push('ProgressmodalPage');

  }

  // submitTest() {

  //   console.log("user ans  " +this.user_ans);

  // }
  
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
    console.log('ionViewDidLoad QuestionPage');
  }

}
