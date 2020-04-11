import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, ToastController, AlertController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-subject',
  templateUrl: 'subject.html',
})
export class SubjectPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public photo: any;
  public subjectId: any;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

    this.db_name = ConstantVariable.db_name;        

    this.subjectId = navParams.get("subjectId");    

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
          
          this.getSubjectDetail();
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e)); 
     
  }

  public subjectDetails: any;
  public currentLevelInfo: any;  
  public totalLevelCount: any;
  public levels: any;
  public level: any = [];
  public i: any;
  public subjectName: any;

  getSubjectDetail() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getLevelsList', "post": { "member_id": this.id, "subject_id": this.subjectId } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.subjectDetails = res['data'];
          this.subjectName = this.subjectDetails.subjectName;
          this.currentLevelInfo = res['data'].currentLevelInfo;
          this.totalLevelCount= res['data'].totalLevelCount;

          for(this.i=1; this.i <= this.totalLevelCount; this.i++) {
            let levelInfo = {'level_no':this.i, 'level_class': 'level-lock'};              
            
            if(this.i < this.currentLevelInfo.currentLevelNumber) {
              levelInfo = {'level_no':this.i, 'level_class': 'level-complete'};
            } 

            if(this.i == this.currentLevelInfo.currentLevelNumber) {
              levelInfo = {'level_no':this.i, 'level_class': 'level-current'};
            } 

            this.level.push(levelInfo);
          }

          this.levels = this.level;
          console.log("levels "+ this.levels); 
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });

  }

  goToLevelSelect(level){
    console.log("selected level is "+ level);
  }

  goToMcqQuestion(level_id) {
    this.navCtrl.push('McqQuestionPage',{
      "subject_id": this.subjectId,
      "level_id": level_id,
      "subjectName": this.subjectName
    });
  }

  profile() {
    this.navCtrl.push('ProfilePage');
  }

  notification(){
    this.navCtrl.push('NotificationPage');
  }

  openMenu(){
    this.menuCtrl.open();
  }
  
  goToBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubjectPage');
  }

}
