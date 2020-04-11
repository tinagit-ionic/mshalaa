import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  public myForm: FormGroup; 
  public name: any;
  public mobile: any;
  public dob: any;
  public gender: any;
  public email: any;
  public city: any;
  public address: any;
  public pincode: any;
  public db_name: any;
  public userinfo: any;
  public id: any;  

  public vfullname: any;
  public vmobile2: any;
  public vdob: any;
  public vgender: any;
  public vemail: any;
  public vcity: any;
  public vaddress: any;
  public vpincode: any;

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

    this.vfullname = navParams.get("fullname");
    this.vmobile2 = navParams.get("mobile2");
    this.vdob = navParams.get("dob");
    this.vgender = navParams.get("gender");
    this.vemail = navParams.get("email");
    this.vcity = navParams.get("city");
    this.vaddress = navParams.get("address");
    this.vpincode = navParams.get("pincode");    

    this.myForm = this.formBuilder.group({
      'name': ['', []],
      'mobile': ['', []],
      'dob': ['', []],
      'gender': ['', []],
      'email': ['', []],      
      'city': ['', []],
      'address': ['', []],
      'pincode': ['', []]      
    });

  }

  editProfile(){

    if(this.name && this.mobile && this.dob && this.email && this.city && this.address && this.pincode){
      
      if(this.id) {

      const loading = this.loadingCtrl.create({ content: 'Loading ...'});
      loading.present();
      setTimeout(() => {
        loading.dismiss();
      }, 2000);

      console.log("id "+this.id);            

      let postParams = {
        "id": this.id,
        "fullname": this.name,
        "dob": this.dob,
        "gender": this.gender,
        "email": this.email,
        "address":this.address,   
        "mobile2":this.mobile,             
        "city":this.city,
        "pincode": this.pincode
      };

      let post_data = { 'api_url': 'updateMemberInfo', "post": postParams };
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
    console.log('ionViewDidLoad ProfileEditPage');
  }

}
