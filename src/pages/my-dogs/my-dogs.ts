import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DogPage } from '../dog/dog';
import { AddDogPage } from '../add-dog/add-dog';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-my-dogs',
  templateUrl: 'my-dogs.html',
})
export class MyDogsPage {

  myDogs: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private ApiProvider: ApiProvider) {
    
  }

  ngOnInit() {
    this.ApiProvider.getMyDogs().subscribe(data => {
      console.log(data , 'sarasaaa');
      this.myDogs = (data["data"]);
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDogsPage');
  }

  goToDogDetail(dog){
    this.navCtrl.push(DogPage, {dogDetail: dog, isMyDogs: true});
  }

  addNewDog(){
    this.navCtrl.push(AddDogPage);
  }
}
