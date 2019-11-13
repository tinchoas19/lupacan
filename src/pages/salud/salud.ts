import { SeccionesSaludPage } from './../secciones-salud/secciones-salud';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-salud',
  templateUrl: 'salud.html',
})
export class SaludPage {
  expand1:boolean=false;
  expand2:boolean=false;
  dog:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.dog = this.navParams.get('dog');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaludPage');
  }

  expand(i){
    if(i === 0){
      this.expand2 = false;
      this.expand1 = !this.expand1;
    }else{
      this.expand1 = false;
      this.expand2 = !this.expand2;
    }
  }

  seccion(i){
    this.navCtrl.push(SeccionesSaludPage,{index:i, dog: this.dog});
  }

}
