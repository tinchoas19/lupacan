import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { AgregarPage } from '../agregar/agregar';

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  public homeTab = HomePage;
  public cuentaTab = ProfileSettingsPage;
  public agregarTab = AgregarPage;

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}
