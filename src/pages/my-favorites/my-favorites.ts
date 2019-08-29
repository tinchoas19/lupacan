import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-my-favorites',
  templateUrl: 'my-favorites.html',
})
export class MyFavoritesPage {
  perros:any;
  locales:any;
  usuarios:any;
  sections:any= 'perros';
  url:string="http://ctrlztest.com.ar/lupacan/apirest/";
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyFavoritesPage');
  }

  ionViewWillEnter(){
    this.storage.get('datauser').then(val=>{
      if(val!=null){
        this.api.getMyFavorites(val['usuarioid']).subscribe(x=>{
          console.log('data',x);
          let data = x['data'];
          this.perros = data['perros'];
          this.usuarios = data['usuarios'];
          this.locales = data['locales'];
        })
      }
    })
  }

}
