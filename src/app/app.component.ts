import { Component, ViewChild } from "@angular/core";
import { Platform, NavController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { Nav } from "ionic-angular";

import { HomePage } from "../pages/home/home";
import { ProfileSettingsPage } from "../pages/profile-settings/profile-settings";
import { LoginPage } from "../pages/login/login";
import { DogPage } from "../pages/dog/dog";
import { MyProfilePage } from "../pages/my-profile/my-profile";
import { Storage } from "@ionic/storage";
import { MainPage } from "../pages/main/main";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any;
  userName:string;
  userLastName:string;
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Nav) navChild: Nav;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    storage: Storage
  ) {
    platform.ready().then(() => {
      storage.get('userData').then(val=>{
        if(val != null){
          this.userName = val['nombre'];
          this.userLastName = val['apellido'];
          this.rootPage = MainPage;
        }else{
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
}
