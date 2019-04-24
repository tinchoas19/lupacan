import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DogPage } from "../dog/dog";
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  public segment: string = 'dog';
  dogs: any = [];
  filteredDogs: any = [];
  public pageData: any = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private ApiProvider: ApiProvider
  ) {  
  }

  goToDogDetail(dog){
    this.navCtrl.push(PhotoSliderPage,{chatid: "8",dogDetail: dog, isMyDogs: false, pageId: this.pageData.id});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
    
  }

  ionViewWillEnter(){
    this.ApiProvider.getDogs().subscribe(data => {
      console.log(data , 'sarasaaa');
      this.dogs = (data["data"]);
    
    this.pageData = this.navParams.data;
    console.log("page: ", this.pageData.id);
    console.log(this.dogs);
    switch (this.pageData.id) {
      case 2:
        this.filteredDogs = this.dogs.filter(item => item.estaperdido == "1");
        break;
      case 3:
        this.filteredDogs = this.dogs.filter(item => item.estaencontrado == "1");
        break;
      case 4:
        this.filteredDogs = this.dogs.filter(item => item.estaenadopcion == "1");
        break;
      default:
        this.filteredDogs = this.dogs;
        break;
    }
    console.log('filtered', this.filteredDogs);
  });
  }

}
