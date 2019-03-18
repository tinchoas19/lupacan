import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-service-detail',
  templateUrl: 'service-detail.html',
})
export class ServiceDetailPage {
  private service: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.service = this.navParams.data;
    console.log("mi servicio: ", this.service);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceDetailPage');
  }

  closeModal() {
    this.navCtrl.pop();
  }

}
