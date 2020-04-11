import { Component,  ElementRef,ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ToastController, AlertController, ModalController, MenuController, ViewController } from 'ionic-angular';
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
  selector: 'page-profile-contact-list',
  templateUrl: 'profile-contact-list.html',
})
export class ProfileContactListPage {

  public db_name: any;
  public userinfo: any;
  public id: any;
  public dataProfile: any;
  public name: any;
  public mobile: any;
  public photo: any = 'assets/img/face.png';

  contact = [];
  groupedContacts = [];

  public imagePath: any;
  public postTitle: any;
  public desc: any;
  public imageNewPath: any;
  public imageChosen: any;
  public base_url: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public crudHttpProvider: CrudHttpProvider, public sqlite: SQLite, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public modalCtrl: ModalController, public menuCtrl: MenuController, public socialSharing: SocialSharing, public contacts: Contacts, public camera: Camera, public transfer: FileTransfer, public storage: Storage, public viewCtrl: ViewController ) {

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

  goToPage(page) {
    this.navCtrl.push(page);
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

  openMenu() {
    this.menuCtrl.open();
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

              this.navCtrl.push('ProfileInviteListPage');
              this.viewCtrl.dismiss();

              let toast = this.toastCtrl.create({
                message: "Invitation sent ",
                duration: 5000,
              });
              toast.present();
              
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
    console.log('ionViewDidLoad ProfileContactListPage');
  }

}
