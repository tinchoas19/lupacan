import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-recupero-pass',
  templateUrl: 'recupero-pass.html',
})
export class RecuperoPassPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperoPassPage');
  }

  recuperarPass(){
    console.log('Recupero Pass => Mail_Usuario');
    console.log('Recupero Pass <= Se genero el cambio de Pass Correctamente');
  }

}
