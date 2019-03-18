import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddDogPage } from '../add-dog/add-dog';
import { CreateServicePage } from '../create-service/create-service';

/**
 * Generated class for the AgregarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-agregar',
  templateUrl: 'agregar.html',
})
export class AgregarPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgregarPage');
  }

  goToAddDog() {
    this.navCtrl.push(AddDogPage);
  }

  goToCreateService() {
    this.navCtrl.push(CreateServicePage);
  }

}
