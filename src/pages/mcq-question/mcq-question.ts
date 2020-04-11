import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, ModalController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import underscore from 'underscore';

@IonicPage()
@Component({
  selector: 'page-mcq-question',
  templateUrl: 'mcq-question.html',
})

export class McqQuestionPage {

  public mcqOneBg: string = '2px; solid #ffffff';
  public mcqTwoBg: string = '2px; solid #ffffff';
  public mcqThreeBg: string = '2px; solid #ffffff'; 
  public mcqFourBg: string = '2px; solid #ffffff'; 
  
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

  public attemptedQuesIndex: any = [];

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

    let post_data = { 'api_url': 'getQuestionsList', "post": { "member_id": 1, "subject_id": 1, "level_id": 1 } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.questionCount = res['data'].questionCount;
          this.questionList = res['data'].questionInfo;
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
  
  public answers: any = [];
  public answer: any = [];
  public tot_answers: any;

  getSingleQues(qlindex, ans, border_a, border_b, border_c, border_d) {

    if(qlindex <= this.questionCount) {
    
      this.mcqOneBg = '2px solid ' + border_a;
      this.mcqTwoBg = '2px solid ' + border_b;
      this.mcqThreeBg = '2px solid ' + border_c;
      this.mcqFourBg = '2px solid ' + border_d;

      this.queInfoZero = this.questionList[qlindex-1]; 
      // console.log("queInfoZero "+JSON.stringify(this.queInfoZero));
      this.currentIndex = qlindex;
      if(this.questionCount > this.currentIndex){
        this.nextIndex = (this.currentIndex + 1);  
      }

      this.questionId = this.queInfoZero.questionId;
      this.question = this.queInfoZero.question;
      this.optionA = this.queInfoZero.optionA;
      this.optionB = this.queInfoZero.optionB;
      this.optionC = this.queInfoZero.optionC;
      this.optionD = this.queInfoZero.optionD;    
      
      setTimeout(() => {
        this.storeResult(this.questionId, ans, qlindex);
      }, 200);

    }

  }

  public queLevel: any;
  public queLevels: any;

  storeResult(question_id, given_answer, qlindex) {

    this.mcqOneBg = '2px solid #ffffff';
    this.mcqTwoBg = '2px solid #ffffff';
    this.mcqThreeBg = '2px solid #ffffff';
    this.mcqFourBg = '2px solid #ffffff';

    this.attemptedQuesIndex.push(qlindex); 
    
    this.answer = {"question_id": question_id, "given_answer": given_answer};

    this.answers[qlindex-1] = this.answer;
    
    // if(!this.answers.length){
    //   this.answers.splice(question_id, 0, this.answer);     
    // }

    console.log("answers " +JSON.stringify(this.answers));   

    if(this.questionCount == (this.answers.length+1)) {
      this.showSubmitBtn = true;
    }

  }

  submitTest() {
      
    // if(this.questionCount >= (this.answers.length+1)){
      
      console.log("answer "+JSON.stringify(this.answers));

      const loading = this.loadingCtrl.create({ content: 'Loading ...'});
      loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 3000);

      let post_data = { 'api_url': 'insertLevelQuesResponse', "post": { "member_id": 1, "subject_id": 1, "level_id": 1, "question_response": this.answers } };
      this.crudHttpProvider.callToCrudPost(post_data)
        .then(data => {

          let res = data;
          if (res['status'] == 100) {

            this.navCtrl.push('ProgressmodalPage', {
              "subject_id": this.subject_id,
              "level_id": this.level_id,
              "subjectName": this.subjectName
            });  
            this.viewCtrl.dismiss();     
            
          } else {

            let toast = this.toastCtrl.create({
              message: 'Something went wrong',
              duration: 3000
            });
            toast.present();
          }
        });

      // } else {

      //   let toast = this.toastCtrl.create({
      //     message: 'All questions are compulsory',
      //     duration: 3000
      //   });
      //   toast.present();

      // }
    
  }

  goToQuestion(i, questionId, question, optionA, optionB, optionC, optionD){

    this.mcqOneBg = '2px solid #ffffff';
    this.mcqTwoBg = '2px solid #ffffff';
    this.mcqThreeBg = '2px solid #ffffff';
    this.mcqFourBg = '2px solid #ffffff';

    this.qnum = i;
    this.questionId = questionId;
    this.question = question;
    this.optionA = optionA;
    this.optionB = optionB;
    this.optionC = optionC;
    this.optionD = optionD;
    
  }

  mcqStatus(user_ans, questionId, border_a, border_b, border_c, border_d) {
    console.log("user ans  " +user_ans);
    console.log("questionId  " +questionId);
    
    this.user_ans = user_ans;

    this.mcqOneBg = '2px solid ' + border_a;
    this.mcqTwoBg = '2px solid ' + border_b;
    this.mcqThreeBg = '2px solid ' + border_c;
    this.mcqFourBg = '2px solid ' + border_d;

    // this.storeResult(questionId, user_ans,);

    // const visit = this.modalCtrl.create('ProgressmodalPage');
    // visit.present();
    // this.navCtrl.push('ProgressmodalPage');

  }

  goToBack() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad McqQuestionPage');
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
