import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { ModalOfferedServicesPage } from '../modal-offered-services/modal-offered-services';

/**
 * Generated class for the EditServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-service',
  templateUrl: 'edit-service.html',
})
export class EditServicePage {
  private service: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.service = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditServicePage');
  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalOfferedServicesPage, characterNum);
    modal.present();
  }
  editService(){

  }
  deleteService(){
    this.showAlert();
  }
 showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Esta seguro que desea eliminar este servicio?',
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log("no");
          }
        },
        {
          text: 'Si',
          handler: data => {
            console.log("si");
          }
        }
      ]
    });
   
      alert.present();
  
  }
}
