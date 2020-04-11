import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-profile-academic-edit',
  templateUrl: 'profile-academic-edit.html',
})
export class ProfileAcademicEditPage {

  public myForm: FormGroup; 
  public course_name: any;
  public college_name: any;
  public admission_yr: any;
  public edu_status: any;

  public db_name: any;
  public userinfo: any;
  public id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public platform: Platform, public sqlite: SQLite, public crudHttpProvider: CrudHttpProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public viewCtrl: ViewController) {

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
          this.id = this.userinfo.id;            
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

    this.myForm = this.formBuilder.group({
      'course_name': ['', []],
      'college_name': ['', []],
      'admission_yr': ['', []],
      'edu_status': ['', []]
    });
  }

  editAcademicProfile(){

    if(this.course_name && this.college_name && this.admission_yr && this.edu_status){
      
      if(this.id) {

      const loading = this.loadingCtrl.create({ content: 'Loading ...'});
      loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 2000);          

      let postParams = {
        "member_id": this.id,
        "courseName": this.course_name,
        "instituteName": this.college_name,
        "courseYear": this.admission_yr,
        "courseStatus": this.edu_status
      };

      let post_data = { 'api_url': 'addMemberQualification', "post": postParams };
      this.crudHttpProvider.callToCrudPost(post_data)
        .then(data => {

          let res = data;
          if (res['status'] == 100) {

            let toast = this.toastCtrl.create({
              message: 'Details updated successfully',
              duration: 3000
            });
            toast.present();

            this.navCtrl.push("ProfilePage");
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
          message: 'Something went wrong',
          duration: 3000
        });
        toast.present();
      }

    } else {
      let toast = this.toastCtrl.create({
        message: 'Some fields are mandatory',
        duration: 3000
      });
      toast.present();
    } 
    
  }

  goToBack(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileAcademicEditPage');
  }

}
