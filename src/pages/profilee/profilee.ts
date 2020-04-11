import { Component,  ElementRef,ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, AlertController, ModalController, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts'; 
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profilee',
  templateUrl: 'profilee.html',
})
export class ProfileePage {

  public transHistory = [
    {
      "image":"assets/img/daily_login.png",
      "transaction": "Daily Login",
      "time":"10:27 pm",
      "rate":"2",
      "rate_img":"assets/img/up_arrow.png"
    },
    {
      "image":"assets/img/download.png",
      "transaction": "Notes download of id - 5",
      "time":"06:51 pm",
      "rate":"2",
      "rate_img":"assets/img/down_arrow.png"
    }
  ];

  public transHistory2 = [
    {
      "image":"assets/img/daily_login.png",
      "transaction": "Daily Login",
      "time":"10:27 pm",
      "rate":"2",
      "rate_img":"assets/img/up_arrow.png"
    },
    {
      "image":"assets/img/gift.png",
      "transaction": "Bonus",
      "time":"02:16 pm",
      "rate":"100",
      "rate_img":"assets/img/up_arrow.png"
    }
  ];

  public invitationList = [
    {
      "image":"assets/img/girl.png",
      "name":"Shweta Shambargade",
      "mobile":"8695741230",
      "status":"INVITE"
    },
    {
      "image":"assets/img/share.png",
      "name":"Anjali Rajesh Bodkhe",
      "mobile":"8695741230",
      "status":"PENDING"
    },
    {
      "image":"assets/img/boy.png",
      "name":"Rahul Bhople",
      "mobile":"8695741230",
      "status":"INVITE"
    }
  ];

  public userProfileStatus: any = true;
  public transactionHistoryStatus: any = false;
  public subscriptionHistoryStatus: any = false;
  public inviteFriendsStatus: any = false;  
  public inviteFriendAddStatus: any = false;
  public invitationListStatus: any = false;

  public db_name: any;
  public userinfo: any;
  public id: any;
  public dataProfile: any;
  public name: any;
  public mobile: any;
  public qualificationDetails: any;
  public qualificationDetailsLength: any;
  public examDetails: any;
  public examDetailsLength: any;
  public photo: any = 'assets/img/face.png';

  contact = [];
  groupedContacts = [];

  public imagePath: any;
  public postTitle: any;
  public desc: any;
  public imageNewPath: any;
  public imageChosen: any;
  public base_url: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public crudHttpProvider: CrudHttpProvider, public sqlite: SQLite, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public modalCtrl: ModalController, public menuCtrl: MenuController, public socialSharing: SocialSharing, public contacts: Contacts, public camera: Camera, public transfer: FileTransfer, public storage: Storage ) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
          this.navCtrl.pop();               
      });
    });

    this.db_name = ConstantVariable.db_name;        
    this.base_url = ConstantVariable.BASE_URL;

    this.sqlite.create({
      name: this.db_name,
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM userLogin', {})
      .then(data => {
        
        if(data.rows.length){
          this.userinfo = data.rows.item(0);  
          this.id = this.userinfo.id;            
          this.getUserProfile();
          this.getInvitationList();
        }

      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

    
    this.contacts.find(["displayName", "phoneNumbers"], {multiple: true, hasPhoneNumber: true}).then((contacts) => {

      for (var i=0 ; i < contacts.length; i++){
       if(contacts[i].displayName !== null){
         var obj = {};
         obj["name"] = contacts[i].displayName;
         obj["number"] = contacts[i].phoneNumbers[0].value;
         this.contact.push(obj)    // adding in separate array with keys: name, number
       }      
      }
  
      this.groupContacts(this.contact);
    });

    this.getTransactionList();

  }

  getUserProfile() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getMemberProfile', "post": { 'id': this.id } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
          this.dataProfile = res['data'];
          this.photo = res['data'].photo;
          this.examDetails = this.dataProfile.examDetails;
          this.examDetailsLength = this.examDetails.length;
          this.qualificationDetails = this.dataProfile.qualificationDetails;
          this.qualificationDetailsLength = this.qualificationDetails.length;
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
    
  }

  getUserPhotoUpdate() {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    let post_data = { 'api_url': 'getMemberProfile', "post": { 'id': this.id } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {
          
          this.photo = res['data'].photo;

          this.sqlite.create({
            name: this.db_name,
            location: 'default'
          }).then((db: SQLiteObject) => {
        
            db.executeSql('update userLogin set photo = ?',[this.photo])
            .then(() => {

            }).catch(e => console.log(e));
          });
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });
    
  }


  groupContacts(contact) {

    let sortedContacts = contact.sort(function(a, b){
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });
  
    let currentLetter = false;
    let currentContacts = [];
  
    sortedContacts.forEach((value, index) => {
      if(value.name.charAt(0) != currentLetter){
        currentLetter = value.name.charAt(0);
  
        let newGroup = {
          letter: currentLetter,
          contacts:[]
        };
  
        currentContacts = newGroup.contacts;
        this.groupedContacts.push(newGroup);
      }
      currentContacts.push(value);
    });

  }

  public mobile_nos: any = []; 
  public myGroupMember: any = [];

  getGroupMember(name, mobile, isChecked:any) {

    console.log("event "+isChecked.checked);
    this.myGroupMember = {name, mobile};

    if(isChecked.checked) {

      this.mobile_nos.push(this.myGroupMember);

    } else {
      let index:number= this.mobile_nos.indexOf(mobile);
      console.log("delete index "+index);
      
      this.mobile_nos.splice(index,1);
      console.log("Group Member " + this.mobile_nos);
    }
    
  }

  // getGroupMember(mobile, isChecked:any) {
    
  //   console.log("event "+isChecked.checked);

  //   if(isChecked.checked) {

  //     this.mobile_nos.push(mobile);

  //     let toast = this.toastCtrl.create({
  //       message: "mobile "+this.mobile_nos,
  //       duration: 7000,
  //     });
  //     toast.present();

  //   } else {
  //     let index:number= this.mobile_nos.indexOf(mobile);
  //     console.log("delete index "+index);
      
  //     this.mobile_nos.splice(index,1);
  //     console.log("Group Member " + this.mobile_nos);
  //   }
    
  // }

  openMenu() {
    this.menuCtrl.open();
  }

  userProfile(){
    this.userProfileStatus         = true;
    this.transactionHistoryStatus  = false;
    this.subscriptionHistoryStatus = false;
    this.inviteFriendsStatus       = false;
    this.inviteFriendAddStatus     = false;    
    this.invitationListStatus      = false;
  }

  transactionHistory(){
    this.userProfileStatus         = false;
    this.transactionHistoryStatus  = true;
    this.subscriptionHistoryStatus = false;
    this.inviteFriendsStatus       = false;
    this.inviteFriendAddStatus     = false;    
    this.invitationListStatus      = false;    
  }

  subscriptionHistory(){
    this.userProfileStatus         = false;
    this.transactionHistoryStatus  = false;
    this.subscriptionHistoryStatus = true;
    this.inviteFriendsStatus       = false;
    this.inviteFriendAddStatus     = false;    
    this.invitationListStatus      = false;    
  }

  inviteFriends(){
    this.userProfileStatus         = false;
    this.transactionHistoryStatus  = false;
    this.subscriptionHistoryStatus = false;
    this.inviteFriendsStatus       = true;
    this.inviteFriendAddStatus     = false;
    this.invitationListStatus      = false;    
  }

  invitationFriend()  {

    const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 4000);

    this.userProfileStatus         = false;
    this.transactionHistoryStatus  = false;
    this.subscriptionHistoryStatus = false;
    this.inviteFriendsStatus       = false;
    this.inviteFriendAddStatus     = true;
    this.invitationListStatus      = false;

  }

  addInvitationFriend() {

    if( this.mobile_nos.length != 0 ) {

      if(this.mobile_nos.length <= 10) {

        const loading = this.loadingCtrl.create({ content: 'Loading ...'});
        loading.present();
        setTimeout(() => {
          loading.dismiss();
        }, 3000);

        let post_data = { 'api_url': 'inviteByMember', "post": { 'member_id': this.id, "invite_mobile": this.mobile_nos } };
        this.crudHttpProvider.callToCrudPost(post_data)
          .then(data => {

            let res = data;
            if (res['status'] == 100) {

              this.userProfileStatus         = false;
              this.transactionHistoryStatus  = false;
              this.subscriptionHistoryStatus = false;
              this.inviteFriendsStatus       = false;
              this.inviteFriendAddStatus     = false;
              this.invitationListStatus      = true;

              this.getInvitationList();

              let toast = this.toastCtrl.create({
                message: "Invitation sent ",
                duration: 5000,
              });
              toast.present();

              this.mobile_nos = [];
              
            } else {

              this.mobile_nos = [];

              let toast = this.toastCtrl.create({
                message: 'Data Inadequate',
                duration: 3000
              });
              toast.present();
            }
          });        

      } else {

        let toast = this.toastCtrl.create({
          message: "You can select maximum 10 contacts",
          duration: 5000,
        });
        toast.present();

      }

    } else {

      let toast = this.toastCtrl.create({
        message: "Select contact",
        duration: 3000,
      });
      toast.present();
    }

  }

  friendList() {

    this.userProfileStatus         = false;
    this.transactionHistoryStatus  = false;
    this.subscriptionHistoryStatus = false;
    this.inviteFriendsStatus       = false;
    this.inviteFriendAddStatus     = false;
    this.invitationListStatus      = true;

    this.getInvitationList();

  }

  public invitesData: any;
  public inviteList: any = [];
  public inviteListLength: any;

  public start: number = 0;
  public flag:any=true;
  public isBusy:any = false;

  getInvitationList(){

    // const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    // loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    // }, 3000);

    this.start = 0;    

    let post_data = { 'api_url': 'getMemberInvitesList', "post": { "member_id": this.id, "limit": this.start } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.invitesData = res['data'];
          this.inviteList = res['data'].inviteList;
          this.inviteListLength = this.inviteList.length;
          this.start += 10;
          this.loadData(this.start);
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });        

  }

  loadData(start) {

    this.isBusy = true;
    this.start = start;

    return new Promise(resolve => {
           
        let post_data = { 'api_url': 'getMemberInvitesList', "post": { "member_id": this.id, "limit": this.start } };

        this.crudHttpProvider.callToCrudPost(post_data)
        .then(data => {

            let res = data;
            if (res['status'] == 100) {

              this.isBusy = false;
              this.start += 10;
              this.inviteList = this.inviteList.concat(res['data']);

              if(res['data'].length <= 10 ){
                this.flag = false;
                if(res['data'].length == 0){
                  this.flag = true;
                }
                console.log(res['data'].length + "  " + res['data']);
                console.log(this.flag);
              }
            }
            resolve(true);
          });

      });
  }

  public transactionList: any;
  public keys: any;

  getTransactionList() {

    // const loading = this.loadingCtrl.create({ content: 'Loading ...'});
    // loading.present();
    // setTimeout(() => {
    //   loading.dismiss();
    // }, 3000);   

    let post_data = { 'api_url': 'getCoinsTransactionList', "post": { "member_id": 1, "currentDate": "" } };
    this.crudHttpProvider.callToCrudPost(post_data)
      .then(data => {

        let res = data;
        if (res['status'] == 100) {

          this.transactionList = res['data'];
          this.keys = Object.keys(this.transactionList);
          console.log(JSON.stringify(this.keys));
          
        } else {

          let toast = this.toastCtrl.create({
            message: 'Data Inadequate',
            duration: 3000
          });
          toast.present();
        }
      });        

  }

  shareRequest() {
    this.socialSharing.share("MPSCSHALA Link " + "http://mpscshala.com", null, null);
  }

  gotoEditProfile(fullname, mobile2, dob, gender, email, city, address, pincode) {
    this.navCtrl.push('ProfileEditPage', {
      "fullname": fullname,
      "mobile2": mobile2,
      "dob": dob, 
      "gender": gender, 
      "email": email, 
      "city": city, 
      "address": address,
      "pincode": pincode
    });
  }

  goToAcademicEdit() {
    this.navCtrl.push('ProfileAcademicEditPage');
  }

  addExam() {
    this.navCtrl.push("ProfileExamEditPage");
  }

  uploadUserProfilePhoto() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    const fileTransfer = new FileTransfer();
  
    this.camera.getPicture(options).then((imageData) => {

      let loader = this.loadingCtrl.create({
        content: "Uploading..."
      });
      loader.present();

      const fileTransfer: FileTransferObject = this.transfer.create();
  
      let options1: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'name.jpg',
        chunkedMode: false,
        mimeType: "image/jpg",
        params: { 'title': this.postTitle, 'description': this.desc },
        //fileName:'fileURL.substr(fileURL.lastIndexOf('/') + 1)',
        headers: {}
      }
    
      fileTransfer.upload(imageData, this.base_url + 'uploadProfilePhoto/' + this.id,
      options1).then((entry) => {
        this.imagePath = '';
        this.imageChosen = 0;
        loader.dismiss();
        
        let alert = this.alertCtrl.create({
          title: 'Upload',
          message: 'Photo uploaded.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.getUserPhotoUpdate();                
              }
            }
          ],
          enableBackdropDismiss: false
        });
        alert.present();
        
      }, (err) => {
        loader.dismiss();
        this.presentToast(err);
        // alert('error'+JSON.stringify(err));
      });
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  logout() {

    let alert = this.alertCtrl.create({
      title: 'Log out',
      message: 'Are you sure to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert =null;
          }
        },
        {
          text: 'Yes',
          handler: () => {

            this.sqlite.create({
              name: this.db_name,
              location: 'default'
            }).then((db: SQLiteObject) => {
        
              db.executeSql('DROP TABLE userLogin', {})
              .then(data => {
                this.navCtrl.push('LoginPage');

                this.storage.remove('colortheme').then(()=>{
                });

              }).catch(e => console.log(e));
            }).catch(e => console.log(e));

          }
        }
      ]
    });
    alert.present();

  }

  themeSettings () {
    this.navCtrl.push('SelectThemePage');
  }

  goToBack() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
