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

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any;
  userName: string;
  email: string;
  imagen:any;
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Nav) navChild: Nav;

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
    public alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      this.pushSetup();
      storage.get('datauser').then(val => {
        if (val != null) {
          console.log('components', val);
          this.imagen = "http://ctrlztest.com.ar/lupacan/apirest/"+val['imagen']
          this.userName = val['nombre'];
          this.email = val['email'];
          this.rootPage = MenuPage;
        } else {
          this.rootPage = LoginPage;
        }
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
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
      //this.services._id = registration['registrationId'];
    });

    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
      this.storage.get('datauser').then(user=>{
        if(user!=null){
          this.api.getNotificacionesSinLeer(user['usuarioid']).subscribe(x=>{
            console.log('misNot',x['data']);
            let numberNot = Number(x['data']);
            console.log('misNot_Parse',numberNot);            
            this.badge.set(numberNot+1);
          })
        }
      })
      if (notification.foreground) {
        alert ("'" + notification.message +"'");
      }
      console.log('perroID {params}-> ' + notification.additionalData.params);
      //if user using app and push notification comes
      if (notification.additionalData.params.perroid > 0) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'Se perdió un Perro!',
          message: notification.message,
          buttons: [{
            text: 'Cancelar',
            role: 'cancel'
          }, {
            text: 'Ver perfil',
            handler: () => {
              //TODO: Your logic here
              console.log('ir a dogPage');
              this.api.getDogData(notification.additionalData.params.perroid).subscribe(dog=>{
                let dataDog = dog['data'];
                this.nav.push(DogPage,{ dogDetail: dataDog});
              })
            }
          }]
        });
        confirmAlert.present();
      } else {
        //if user NOT using app and push notification comes
        //TODO: Your logic on click of push notification directly
        //this.nav.push(MenuPage, { message: notification.message });
        console.log('Push notification clicked');
      }      
    });

    
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  
  goToMyProfile() {
    this.nav.push(MyProfilePage);
  }

  logOut() {
    this.storage.set('userData', null);
    this.menuCtrl.close();
    var nav = this.app.getRootNav();
    nav.setRoot(LoginPage);
    //this.nav.setRoot(LoginPage);
  }

}
