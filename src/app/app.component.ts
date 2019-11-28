import { TransferenciaPage } from './../pages/transferencia/transferencia';
import { ApiProvider } from './../providers/api/api';
import { DogPage } from './../pages/dog/dog';
import { Component, ViewChild } from "@angular/core";
import { Platform, NavController, MenuController, App, AlertController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Nav } from "ionic-angular";
import { HomePage } from "../pages/home/home";
import { ProfileSettingsPage } from "../pages/profile-settings/profile-settings";
import { LoginPage } from "../pages/login/login";
import { MyProfilePage } from "../pages/my-profile/my-profile";
import { Storage } from "@ionic/storage";
import { MenuPage } from "../pages/menu/menu";
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Badge } from '@ionic-native/badge';
import { Diagnostic } from '@ionic-native/diagnostic';
import { IntervalProvider } from '../providers/interval/interval';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any;
  userName: string;
  email: string;
  imagen: any;
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Nav) navChild: Nav;
  public isLocationEnabled: boolean = false;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    private push: Push,
    public app: App,
    public storage: Storage,
    private api: ApiProvider,
    private badge: Badge,
    public alertCtrl: AlertController,
    private _DIAGNOSTIC: Diagnostic,
    private interval: IntervalProvider,
    public screenOrientation: ScreenOrientation,
    private locationAccuracy: LocationAccuracy
  ) {
    platform.ready().then(() => {
      this.pushSetup();
      this.isLocationAvailable();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('android')) {
        statusBar.backgroundColorByHexString("#33000000");
      }
      splashScreen.hide();
      this.storage.get('datauser').then(val => {
        if (val != null) {
          console.log('components', val);
          this.imagen = "https://ctrlztest.com.ar/lupacan/apirest/" + val['imagen']
          this.userName = val['nombre'];
          this.email = val['email'];
          this.rootPage = MenuPage;

            /* this.api.updateFirebase(val['usuarioid'],registration['registrationId']).subscribe(x=>{
           console.log('updateFirebase',x);
           let data = JSON.parse(x['_body'])['data'];
           if(data == 'inserted'){
             this.rootPage = MenuPage;
           }
         })    */
        } else {
          this.rootPage = LoginPage;
        }
      })
      screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);
    });
  }

  pushSetup() {
    // to initialize push notifications
    const options: PushOptions = {
      android: {
        senderID: '522555540369',
        forceShow: 'true'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };

    const pushObject: PushObject = this.push.init(options);
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      console.log('_id', registration['registrationId']);
      this.storage.set('firebaseUserId', registration['registrationId']);
      /* this.storage.get('datauser').then(val => {
        if (val != null) {
          console.log('components', val);
          this.imagen = "https://ctrlztest.com.ar/lupacan/apirest/" + val['imagen']
          this.userName = val['nombre'];
          this.email = val['email'];
          this.rootPage = MenuPage;
          
          this.api.updateFirebase(val['usuarioid'],registration['registrationId']).subscribe(x=>{
            console.log('updateFirebase',x);
            let data = JSON.parse(x['_body'])['data'];
            if(data == 'inserted'){
              this.rootPage = MenuPage;
            }
          }) 
        } else {
          this.rootPage = LoginPage;
        }
      }) */
      //this.services._id = registration['registrationId'];
    });

    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
      this.storage.get('datauser').then(user => {
        if (user != null) {
          this.api.getNotificacionesSinLeer(user['usuarioid']).subscribe(x => {
            console.log('misNot', x['data']);
            let numberNot = Number(x['data']);
            console.log('misNot_Parse', numberNot);
            this.badge.set(numberNot + 1);
          })
        }
      })
      if (notification.foreground) {
        alert("'" + notification.message + "'");
      }
      console.log('perroID {params}-> ' + notification.additionalData.params);
      //if user using app and push notification comes
      switch (notification.additionalData.params.tipo) {
        case 'encontrado':
          let confirmAlert = this.alertCtrl.create({
            title: 'Encontraron a tu amigo!',
            message: notification.message,
            buttons: [{
              text: 'Cancelar',
              role: 'cancel'
            }, {
              text: 'Ver perfil',
              handler: () => {
                //TODO: Your logic here
                console.log('ir a dogPage');
                this.api.getDogData(notification.additionalData.params.perroid).subscribe(dog => {
                  let dataDog = dog['data'][0];
                  console.log('dataNOTIFICACION', dataDog);
                  this.nav.push(DogPage, { dogDetail: dataDog });
                })
              }
            }]
          });
          confirmAlert.present();
          break;
        case 'transferencia':
          let confirmAlert2 = this.alertCtrl.create({
            title: 'Transferencia!',
            message: notification.message,
            buttons: [{
              text: 'Cancelar',
              role: 'cancel'
            }, {
              text: 'Ver',
              handler: () => {
                //TODO: Your logic here
                console.log('ir a TransferenciaPage');
                this.api.getDogData(notification.additionalData.params.perroid).subscribe(dog => {
                  let dataDog = dog['data'][0];
                  console.log('dataNOTIFICACION', dataDog);
                  this.nav.push(TransferenciaPage, { dogDetail: dataDog });
                })
              }
            }]
          });
          confirmAlert2.present();
          break;

          case 'tenencia':
          let confirmAlert3 = this.alertCtrl.create({
            title: 'Tenencia compartida!',
            message: notification.message,
            buttons: [{
              text: 'Cancelar',
              role: 'cancel'
            }, {
              text: 'Ver',
              handler: () => {
                //TODO: Your logic here
                console.log('ir a TransferenciaPage');
                this.api.getDogData(notification.additionalData.params.perroid).subscribe(dog => {
                  let dataDog = dog['data'][0];
                  console.log('dataNOTIFICACION', dataDog);
                  this.nav.push(TransferenciaPage, { dogDetail: dataDog, index: 1 });
                })
              }
            }]
          });
          confirmAlert3.present();
          break;

        default:
          break;
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  isLocationAvailable() {
    this.locationAccuracy.canRequest().then((canRequest) => {
      console.log('canReq', canRequest);
      // the accuracy option will be ignored by iOS
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => console.log('Request successful'),
        error => {
          this.showAlert();
          console.log('Error requesting location permissions', error);
        }
      );
    });
    console.log('entro_diagnostic');
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Ubicación',
      subTitle: 'Para poder usar LupaCan, debes tener activada la ubicación del celular. Por favor!',
      buttons: ['OK']
    });
    alert.present();
  }


  goToMyProfile() {
    this.nav.push(MyProfilePage);
  }

  logOut() {
    this.storage.set('datauser', null);
    this.menuCtrl.close();
    var nav = this.app.getRootNav();
    nav.setRoot(LoginPage);
    //this.nav.setRoot(LoginPage);
  }

}
