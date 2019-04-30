import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddDogPage } from '../add-dog/add-dog';
import { MisionPage } from '../mision/mision';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  terminos:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registrarme(){
    this.navCtrl.push(MisionPage);    
  }

  toggleCheckbox(){
    this.terminos = !this.terminos;
  }
}
