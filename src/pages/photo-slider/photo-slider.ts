import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PhotoSliderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-photo-slider',
  templateUrl: 'photo-slider.html',
})
export class PhotoSliderPage {

  private imageCollection: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.imageCollection = navParams.data;
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoSliderPage');
  }

}
