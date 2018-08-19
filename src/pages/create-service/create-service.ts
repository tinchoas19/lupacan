import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController } from 'ionic-angular';
import { ModalOfferedServicesPage } from '../modal-offered-services/modal-offered-services';

/**
 * Generated class for the CreateServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-service',
  templateUrl: 'create-service.html',
})
export class CreateServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
  }


  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalOfferedServicesPage, characterNum);
    modal.present();
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateServicePage');
  }

}
