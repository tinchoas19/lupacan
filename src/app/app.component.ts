import { Component, ViewChild } from "@angular/core";
import { Platform, NavController, MenuController, App } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Nav } from "ionic-angular";
import { HomePage } from "../pages/home/home";
import { ProfileSettingsPage } from "../pages/profile-settings/profile-settings";
import { LoginPage } from "../pages/login/login";
import { DogPage } from "../pages/dog/dog";
import { MyProfilePage } from "../pages/my-profile/my-profile";
import { Storage } from "@ionic/storage";
import { MenuPage } from "../pages/menu/menu";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any= LoginPage;
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
    public app: App,
    public storage: Storage
  ) {
    platform.ready().then(() => {
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
