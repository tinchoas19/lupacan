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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

}
