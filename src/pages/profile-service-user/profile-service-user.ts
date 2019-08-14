import { AddDogPage } from './../add-dog/add-dog';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditServicePage } from '../edit-service/edit-service';
import { PhotoSliderPage } from '../photo-slider/photo-slider';


@Component({
  selector: 'page-profile-service-user',
  templateUrl: 'profile-service-user.html',
})
export class ProfileServiceUserPage {
  dataService:any;
  expanded:boolean = false;
  apiUrl:any="http://ctrlztest.com.ar/lupacan/apirest/";
  comments:any=[];
  dogsRefugio:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider
  ) {
    this.dataService = this.navParams.data;
    console.log(this.dataService);
  }

  ionViewWillEnter(){
    this.api.getComments(this.dataService['localid']).subscribe(x=>{
      console.log('comments', x);
      this.comments = x['data'];
    })
    this.getRefugioDogs();
  }

  getRefugioDogs(){
    this.api.getMyDogRefugios(this.dataService['localid']).subscribe(x=>{
      console.log('x_dogsRefugio',x);
      this.dogsRefugio = x['data'];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileServiceUserPage');
  }

  goToDogDetail(dog){
    this.navCtrl.push(PhotoSliderPage,{chatid: "8",dogDetail: dog, isMyDogs: false});
  }

  goToService() {
    this.navCtrl.push(EditServicePage, this.dataService);
  }

  vercomentarios(){
    this.expanded = !this.expanded;
  }

  addDog(){
    console.log('refugioid', this.dataService['localid'])
    this.navCtrl.push(AddDogPage,{refugio:true, refugioid: this.dataService['localid']});
  }
}
