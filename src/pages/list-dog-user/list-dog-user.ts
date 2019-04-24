import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { IntDogUserPage } from './../int-dog-user/int-dog-user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-list-dog-user',
  templateUrl: 'list-dog-user.html',
})
export class ListDogUserPage {

  nombreUser:String;
  idUser:any;
  misPerros:any=[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private services: ApiProvider
  ) {
  }

  ionViewWillEnter(){
    this.nombreUser = this.navParams.get('userName');
    this.idUser = this.navParams.get('id');
    console.log(this.idUser);
    this.services.getMyDogs(this.idUser).subscribe(data=>{
      console.log('vuelta', data);
      this.misPerros = data['data'];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDogUserPage');
    console.log('data', this.navParams.data);
  }

  goToDogDetail(dog){
    this.navCtrl.push(PhotoSliderPage,{
      dogDetail: dog, 
      isMyDogs: false, 
      vuelta:true, pageId: 
      this.navParams.get('pageId')
    });
  }

}
