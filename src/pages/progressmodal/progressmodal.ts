import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController, ViewController, Platform, AlertController, App, LoadingController, MenuController } from 'ionic-angular';
import { ConstantVariable } from '../../app/constant-variable';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-progressmodal',
  templateUrl: 'progressmodal.html',
})
export class ProgressmodalPage {

  @ViewChild('doughnutCanvas') doughnutCanvas;

  doughnutChart: any;

  public db_name: any;
  public userinfo: any;
  public id: any;
  public level_id: number;
  public subject_id: any;
  public fullname: any;
  public progressData: any;

  public totalQue: any;
  public queCorrect: any;
  public queIncorrect: any;
  public subjectName: any;
  public levelStatus: any;
  public holdTimeStamp: any;
  public photo: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController, public crudHttpProvider: CrudHttpProvider, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public sqlite: SQLite, public platform: Platform, public menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

    this.level_id = navParams.get("level_id");      
    this.subject_id = navParams.get("subject_id");
    this.subjectName = navParams.get("subjectName");    

    this.db_name = ConstantVariable.db_name;            

    this.sqlite.create({
      name: this.db_name,
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM userLogin', {})
      .then(data => {
        
        if(data.rows.length){

          this.userinfo = data.rows.item(0);  
          this.id = this.userinfo.id;      
          this.fullname = this.userinfo.fullname;     
          this.photo = this.userinfo.photo;
          
          this.progressReport();
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
    this.progressReport();    

  }

  progressReport() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getLevelQuesResponse', "post": { "member_id": 1, "subject_id": 1, "level_id": 1 } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.progressData = res['data'];
          this.totalQue =  res['data'].totalQue;
          this.queCorrect =  res['data'].queCorrect;
          this.queIncorrect = this.totalQue - this.queCorrect;
          this.levelStatus = res['data'].levelStatus;
          this.holdTimeStamp = res['data'].holdTimeStamp;       
          this.ionViewDidLoad();

        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
    
  }

  goToNextLevel() {

    this.navCtrl.push('McqQuestionPage',{
      "subject_id": this.subject_id,
      "level_id": (this.level_id+1),
      "subjectName": this.subjectName
    });
    this.viewCtrl.dismiss();    

  }

  retakeTest() { 

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getLevelQuesResponse', "post": { "member_id": this.id, "subject_id": this.subject_id, "level_id": this.level_id } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.levelStatus = res['data'].levelStatus;

          if(this.levelStatus == 'OK') {

            this.navCtrl.push('McqQuestionPage',{
              "subject_id": this.subject_id,
              "level_id": this.level_id,
              "subjectName": this.subjectName
            });
            this.viewCtrl.dismiss();

          } else {

            let toast = this.toastCtrl.create({
              message: 'Unlock level at '+ this.holdTimeStamp,
              duration: 3000
            });
            toast.present();

          }

        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
    
  }

  goToHome() {
    this.navCtrl.push(HomePage);
    this.viewCtrl.dismiss();
  }

  reviewLevel() {
    this.navCtrl.push('ReviewLevelPage', {
      "subject_id": this.subject_id,
      "level_id": this.level_id
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgressmodalPage');

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
          labels: ["चूक", "बरोबर"],
          datasets: [{
              label: '# of Votes',
              data: [this.queIncorrect, this.queCorrect],
              backgroundColor: [
                  '#F8A4A6',
                  '#AFE2BD'
                  // '#8B92F8'
                  // 'rgba(75, 192, 192, 0.2)',
                  // 'rgba(153, 102, 255, 0.2)',
                  // 'rgba(255, 159, 64, 0.2)'
              ],
              hoverBackgroundColor: [
                  "#FF060B",
                  "#045118"
                  // "#0011FF"
                  // "#FF6384",
                  // "#36A2EB",
                  // "#FFCE56"
              ]
          }]
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

}