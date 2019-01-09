import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyDogsPage } from '../my-dogs/my-dogs';
import { MyProfilePage } from '../my-profile/my-profile';
import { FoundDogPage } from '../found-dog/found-dog';
import { CreateServicePage } from '../create-service/create-service';
import { MyServicesPage } from '../my-services/my-services';

@Component({
  selector: 'page-first-profile-settings',
  templateUrl: 'first-profile-settings.html',
})
export class FirstProfileSettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstProfileSettingsPage');
  }
  goToMyDogs() {
    this.navCtrl.push(MyDogsPage);
  }
  goToMyProfile() {
    this.navCtrl.push(MyProfilePage);
  }
  goToIFindADog() {
    this.navCtrl.push(FoundDogPage);
  }
  goToCreateService(){
    this.navCtrl.push(CreateServicePage);
  }
  goToMyServices(){
    this.navCtrl.push(MyServicesPage);
  }
  goToHome(){
    this.navCtrl.push(HomePage);
  }

}
