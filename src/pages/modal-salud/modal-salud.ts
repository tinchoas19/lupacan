import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal-salud',
  templateUrl: 'modal-salud.html',
})
export class ModalSaludPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    console.log('UserId', this.navParams.get('title'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalSaludPage');
  }

  cerrar(){
    let result = "se cerró";
    this.viewCtrl.dismiss({result:result});
  }

  guardar(){
    let result = "se guardó";
    this.viewCtrl.dismiss({result:result});
  }

}
