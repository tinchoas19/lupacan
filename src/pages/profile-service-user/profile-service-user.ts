import { DescuentosPage } from './../descuentos/descuentos';
import { SlidePremiumPage } from './../slide-premium/slide-premium';
import { AddDogPage } from './../add-dog/add-dog';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { EditServicePage } from '../edit-service/edit-service';
import { PhotoSliderPage } from '../photo-slider/photo-slider';


@Component({
  selector: 'page-profile-service-user',
  templateUrl: 'profile-service-user.html',
})
export class ProfileServiceUserPage {
  @ViewChild('input') myInput ;

  dataService:any;
  expanded:boolean = false;
  mostrarDescuentos:boolean = false;
  apiUrl:any="http://ctrlztest.com.ar/lupacan/apirest/";
  comments:any=[];
  dogsRefugio:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    public modalCtrl: ModalController
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

  updateCucumber(){
    setTimeout(() => {
      this.myInput.setFocus();
    },150);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileServiceUserPage');
  }

  localPremium(){
    this.navCtrl.push(SlidePremiumPage, {localid: this.dataService['localid']})
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

  verDescuentos(){
    let profileModal = this.modalCtrl.create(DescuentosPage,{localid:this.dataService['localid']});
    profileModal.present();
  }

  addDog(){
    console.log('refugioid', this.dataService['localid'])
    this.navCtrl.push(AddDogPage,{refugio:true, refugioid: this.dataService['localid']});
  }
}
