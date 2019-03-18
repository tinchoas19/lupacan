import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddDogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-dog',
  templateUrl: 'add-dog.html',
})
export class AddDogPage {

  public razas:any=[
  {
    name:'Mestizo'
  },{
    name:'Labrador'
  },{
    name:'Bulldog'
  },{
    name:'Bulldog francés'
  },{
    name:'Caniche'
  },{
    name:'Pastor Alemán'
  },{
    name:'Beagle'
  },{
    name:'Golden'
  },{
    name:'Pug'
  },{
    name:'Pitbull'
  },{
    name:'Chihuahua'
  },
]

  searchQuery: string = '';
  lugares: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initializeItems();
  }

  initializeItems() {
    this.lugares = [
      'Amsterdam',
      'Bogota',
      'Buenos Aires',
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDogPage');
  }

  irAHome(){
    this.navCtrl.push(HomePage);    
  }

  irAAgregar(){
    this.navCtrl.push(AddDogPage);    
  }

  agregarFoto(){
    
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.lugares = this.lugares.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }s

}
