import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, Platform, LoadingController, ToastController, ViewController, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { CrudHttpProvider } from '../../providers/crud-http/crud-http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ConstantVariable } from '../../app/constant-variable';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  public mobile: any;
  public db_name: any;
  public url_play_store: any;
  public buttonDisabled: any;
  public userinfo: any;
  public stored_mb: any;

  imageURI:any;
  imageFileName:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public platform: Platform, public network: Network, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public crudHttpProvider: CrudHttpProvider, public sqlite: SQLite, public viewCtrl: ViewController, public events: Events, public menuCtrl: MenuController, public camera: Camera, public file: File, public transfer: FileTransfer) {

    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {

        let alert = this.alertCtrl.create({
          title: 'Exit',
          message: 'Do you want to Exit?',
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
                navigator['app'].exitApp();
              }
            }
          ]
        });
        alert.present();
                    
      });
    });

    this.db_name = ConstantVariable.db_name;

    this.getData();
    
  }

  getData() {

    this.sqlite.create({
      name: this.db_name,
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('CREATE TABLE IF NOT EXISTS userLogin(rowid INTEGER PRIMARY KEY AUTOINCREMENT, id TEXT, fullname TEXT, mobile1 TEXT, dob TEXT, city TEXT, gender TEXT, photo TEXT)', {})
      .then(data => console.log('Executed SQL'))
      .catch(e => console.log(e));

      db.executeSql('SELECT * FROM userLogin', {})
      .then(data => {

        if(data.rows.length){
          this.userinfo = data.rows.item(0);     
          this.stored_mb = this.userinfo.mobile1;

          // let toast = this.toastCtrl.create({
          //   message: 'smb' +this.stored_mb,
          //   duration: 3000
          // });
          // toast.present();

          if(this.stored_mb) {
            this.navCtrl.push(HomePage); 
            this.viewCtrl.dismiss();              
          }

        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));

  }

  public imagePath: any;
  public postTitle: any;
  public desc: any;
  public imageNewPath: any;
  public imageChosen: any;

  getImage() {

    const loading = this.loadingCtrl.create({ content: 'Uploading ...'});
    loading.present();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    const fileTransfer = new FileTransfer();
  
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;

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
    
      fileTransfer.upload(imageData, 'http://test.mpscshala.com/_api/service/uploadProfilePhoto/4',
      options1).then((entry) => {
        this.imagePath = '';
        this.imageChosen = 0;
        loading.dismiss();
        
        let alert = this.alertCtrl.create({
          title: 'Upload',
          message: 'Photo uploaded.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                
              }
            }
          ],
          enableBackdropDismiss: false
        });
        alert.present();
        
      }, (err) => {
        alert('error'+JSON.stringify(err));
      });
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }
  
    fileTransfer.upload(this.imageURI, 'http://test.mpscshala.com/_api/service/uploadProfilePhoto/4', options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      this.imageFileName = "http://192.168.1.103/mpscshala.com/data/member-avatar/m3.png"
      loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      console.log(err);
      loader.dismiss();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }

  openMenu() {
    this.menuCtrl.open();
  }

  start() {
    this.navCtrl.push('LoginPage');
  }

  checkNetwork() {
    
    this.network.onDisconnect().subscribe(() => {

      this.buttonDisabled = true;

      let toast = this.toastCtrl.create({
        message: "Can't reach the server.",
        duration: 10000,
        cssClass: "noNetworkToast"
      });
      toast.present();

    }); 

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
