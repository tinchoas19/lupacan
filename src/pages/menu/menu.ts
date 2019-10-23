import { ApiProvider } from './../../providers/api/api';
import { MyFavoritesPage } from './../my-favorites/my-favorites';
import { CreateServicePage } from './../create-service/create-service';
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
    expand2: boolean = false;
    rootPage= MainPage;
    userName: string;
    email: string;
    imagen: any;
    dataUser:any;
    mostrar:boolean = false;
    expand1:boolean = false;
    @ViewChild(Nav) nav: Nav;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private appCtrl: App,
        public menuCtrl: MenuController,
        private barcodeScanner: BarcodeScanner,
        public loadingCtrl : LoadingController,
        private api: ApiProvider,
        private storage: Storage
    ) {
        this.getStorage();
        console.log("params", this.navParams.data);
    }

    openItem(){
        this.expand1 = !this.expand1;
    }

    openItem2(){
        this.expand2 = !this.expand2;
    }

    goToMyProfile() {
        this.nav.push(MyProfilePage);
    }

    goToMyServices() {
        this.navCtrl.push(MyServicesPage,false);
    }

    goToMyRefugios(){     
        this.navCtrl.push(MyServicesPage,true);
    }
    
    goToCreateRefugio(){
        this.navCtrl.push(CreateServicePage, {refugio:true});
    }

    goToMyFavRefugio(){
        this.navCtrl.push(MyFavoritesPage);        
    }

    goToMyDogs(){
        this.navCtrl.push(MyDogsPage)
    }

    ionViewWillEnter(){
        
    }

    getStorage(){
        this.storage.get('datauser').then(val=>{
            console.log('valMnu', val);
            this.dataUser = val;
            if(this.dataUser.mostrartelefono > 0){
                this.mostrar = true;
            }else this.mostrar = false;
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

    ocultarTelefono(event,dataUser){
        if(event.checked){
            this.api.mostrarTelefono(dataUser.usuarioid, 1).subscribe(x=>{
                console.log('x',x);
                let data = JSON.parse(x['_body'])['status_message'];
                if(data = 'event created'){
                    this.api.getUser(dataUser.usuarioid).subscribe(y=>{
                        this.storage.set('datauser', y['data']);
                    })
                    this.ionViewWillEnter();
                }
            })
        }else{
            this.api.mostrarTelefono(dataUser.usuarioid, 0).subscribe(x=>{
                console.log('x',x);
                let data = JSON.parse(x['_body'])['status_message'];
                if(data = 'event created'){
                    this.api.getUser(dataUser.usuarioid).subscribe(y=>{
                        this.storage.set('datauser', y['data']);
                    })
                    this.ionViewWillEnter();
                }
            })
        }
    }

    goToAddServices(){
        this.navCtrl.push(CreateServicePage);
    }

    goToMyFavServices(){
        this.navCtrl.push(MyFavoritesPage,'locales');
    }

    goToMyFavRefugios(){
        this.navCtrl.push(MyFavoritesPage,'refugios');
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