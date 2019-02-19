import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AddDogPage } from '../add-dog/add-dog';

/**
 * Generated class for the MisionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mision',
  templateUrl: 'mision.html',
})
export class MisionPage {
  slides: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.slides = [
      {
        title: "Mision",
        description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
        image: "assets/img/ica-slidebox-img-1.png",
      },
      {
        title: "Vision",
        description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
        image: "assets/img/ica-slidebox-img-2.png",
      },
      {
        title: "Objetivo",
        description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
        image: "assets/img/ica-slidebox-img-3.png",
      }
    ];
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MisionPage');
  }

  irAInicio(){
    this.navCtrl.push(AddDogPage);
  }

}
