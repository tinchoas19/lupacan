import { MyServicesPage } from './../my-services/my-services';
import { Component, ViewChild } from "@angular/core";
import { Platform, NavController, MenuController, App, IonicPage, NavParams, LoadingController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Nav } from "ionic-angular";
import { HomePage } from "../../pages/home/home";
import { ProfileSettingsPage } from "../../pages/profile-settings/profile-settings";
import { LoginPage } from "../../pages/login/login";
import { DogPage } from "../../pages/dog/dog";
import { MyProfilePage } from "../../pages/my-profile/my-profile";
import { Storage } from "@ionic/storage";
import { MainPage } from "../../pages/main/main";
import { MyDogsPage } from '../my-dogs/my-dogs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@IonicPage()
@Component({
    selector: "page-menu",
    templateUrl: "menu.html"
})
export class MenuPage {
    rootPage= MainPage;
    userName: string;
    email: string;
    imagen: any;
    dataUser:any;
    @ViewChild(Nav) nav: Nav;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private appCtrl: App,
        public menuCtrl: MenuController,
        private barcodeScanner: BarcodeScanner,
        public loadingCtrl : LoadingController,
        private storage: Storage
    ) {
        console.log("params", this.navParams.data);
    }

    goToMyProfile() {
        this.nav.push(MyProfilePage);
    }

    goToMyServices() {
        this.nav.push(MyServicesPage);
    }

    goToMyDogs(){
        this.navCtrl.push(MyDogsPage)
    }

    ionViewWillEnter(){
        this.getStorage();
    }

    getStorage(){
        this.storage.get('datauser').then(val=>{
            console.log('valMnu', val);
            this.dataUser = val;
            console.log('userHome', this.dataUser);
            if(this.dataUser.imagen == "" && this.dataUser.facebookid != ""){
                this.imagen = "https://graph.facebook.com/"+this.dataUser.facebookid+"/picture?type=large";                           
            }else if(this.dataUser.imagen != ""){
                this.imagen = "http://ctrlztest.com.ar/lupacan/apirest/"+this.dataUser.imagen        
            }else{
                this.imagen = '../../assets/imgs/1.jpg';                        
            }
        })
    }

    logOut() {
        this.storage.set('userData', null);
        this.menuCtrl.close();
        var nav = this.appCtrl.getRootNav();
        nav.setRoot(LoginPage);
        //this.nav.setRoot(LoginPage);
    }

    scanCode(){
        let loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Espere por favor...'
        });
        this.barcodeScanner.scan({
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : false, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          prompt : "Coloque el código de QR dentro del área de escaneo", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
        }).then(barcodeData =>{
          console.log('data', barcodeData);
          if(barcodeData.text != ""){
            loading.present();
          }
        }).catch((err) => {
          // This seems to happen only when the "back" button is pressed
         //this.showCancelledAlert();
         console.log('erro',err);
      });
      }
}