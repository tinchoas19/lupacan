import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AddDogPage } from '../add-dog/add-dog';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-mision',
  templateUrl: 'mision.html',
})
export class MisionPage {
  slides: any;
  items: any[];
  displayProperty: string;
  selectedItem: any;
  searchQuery: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private services: ApiProvider,
    private storage: Storage,
    public viewCtrl: ViewController
  ) {
    this.initializeItems();
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

  irAInicio() {
    this.navCtrl.push(AddDogPage);
  }

  initializeItems() {
    this.services.getBreed().subscribe(data => {
      console.log('raza', data);
      this.items = data['data']['colores'];
    })
  }

  getItems(ev: any) {

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item['nombre'].toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      // Reset items back to all of the items
      this.initializeItems();
    }
  }

  select(i){
    let data = i;
    this.viewCtrl.dismiss(data);
  }


  dismiss() {
    this.viewCtrl.dismiss();
    //this.navCtrl.dismiss(this.selectedItem);
  }

}
