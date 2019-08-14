import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProfileServiceUserPage } from '../profile-service-user/profile-service-user';


@Component({
  selector: 'page-refugio',
  templateUrl: 'refugio.html',
})
export class RefugioPage {

  dataRefugio:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private storage: Storage
  ) {
  }

  ionViewWillEnter(){
    this.storage.get('datauser').then(val=>{
      if(val!=null){
        this.api.getMyRefugios(val['usuarioid']).subscribe(x=>{
          this.dataRefugio = x['data'];
          console.log('data',this.dataRefugio);
        })
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RefugioPage');
  }

  goToServicio(ref){
    this.navCtrl.push(ProfileServiceUserPage, ref);
    console.log('ref', ref);
  }

}
