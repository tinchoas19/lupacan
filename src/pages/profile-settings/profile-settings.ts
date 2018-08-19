import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyDogsPage } from '../my-dogs/my-dogs';
import { MyProfilePage } from '../my-profile/my-profile';
import { FoundDogPage } from '../found-dog/found-dog';
import { CreateServicePage } from '../create-service/create-service';
import { MyServicesPage } from '../my-services/my-services';



@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileSettingsPage');
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
}
