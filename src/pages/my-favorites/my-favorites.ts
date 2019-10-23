import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-my-favorites',
  templateUrl: 'my-favorites.html',
})
export class MyFavoritesPage {
  msj: string;
  sinfavotritos: boolean;
  perros:any;
  locales:any;
  usuarios:any;
  refugios:any;
  sections:any;
  data:any;
  url:string="http://ctrlztest.com.ar/lupacan/apirest/";
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider
  ) {
    this.data = this.navParams.data;
    this.controlData(this.data);
  }

  controlData(data){
    this.sections = "";
    console.log('param',data);
    if(this.data == 'locales'){
      this.sections = 'locales';
    } 
    else if(this.data == 'refugios'){
      this.sections = 'refugios';
    }else{
      this.sections = 'usuarios';
    }
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
          this.refugios = this.locales.filter(local=>local.refugio == true);
        })
      }else if(this.perros.length == 0){
        this.sinfavotritos = true;
      }
      else if(this.usuarios.length == 0){
        this.sinfavotritos = true;
      }
      else if(this.locales.length == 0){
        this.sinfavotritos = true;
      }
      else if(this.refugios.length == 0){
        this.sinfavotritos = true;
      }
    })
  }

}
