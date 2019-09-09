import { FormularioPublicitarPage } from './../formulario-publicitar/formulario-publicitar';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';


@Component({
  selector: 'page-publicitar',
  templateUrl: 'publicitar.html',
})
export class PublicitarPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicitarPage');
  }

  goTopaquete(){
    const modal = this.modalCtrl.create(FormularioPublicitarPage);
    modal.present();
  }
}


