import { PerfilCallejeritoPage } from './../perfil-callejerito/perfil-callejerito';
import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { ServiceDetailPage } from './../service-detail/service-detail';
import { ListDogUserPage } from './../list-dog-user/list-dog-user';
import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-my-favorites',
  templateUrl: 'my-favorites.html',
})
export class MyFavoritesPage {
  sinfavotritosRefugio: boolean;
  sinfavotritosLocal: boolean;
  sinfavotritosUsuario: boolean;
  msj: string;
  sinfavotritosPerros: boolean;
  perros: any;
  locales: any;
  usuarios: any;
  refugios: any;
  sections: any;
  data: any;
  url: string = "https://ctrlztest.com.ar/lupacan/apirest/";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider
  ) {
    this.data = this.navParams.data;
    this.controlData(this.data);
  }

  controlData(data) {
    this.sections = "";
    console.log('param', data);
    if (this.data == 'locales') {
      this.sections = 'locales';
    }
    else if (this.data == 'refugios') {
      this.sections = 'refugios';
    } else if (this.data == 'perros') {
      this.sections = 'perros';
    } else {
      this.sections = 'usuarios';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyFavoritesPage');
  }

  ionViewWillEnter() {
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.api.getMyFavorites(val['usuarioid']).subscribe(x => {
          console.log('data', x);
          let data = x['data'];
          this.perros = data['perros'];
          if (this.perros.length == 0) {
            console.log('1');

            this.sinfavotritosPerros = true;
          }
          this.usuarios = data['usuarios'];
          this.locales = data['locales'];
          if (this.locales.length > 0) {
            this.refugios = this.locales.filter(local => local.refugio == true);
            if (this.refugios.length == 0) {
              this.sinfavotritosRefugio = true;
            }
          } else {
            this.sinfavotritosLocal = true;
            this.sinfavotritosRefugio = true;
          }
          if (this.usuarios.length == 0) {
            console.log('2');

            this.sinfavotritosUsuario = true;
          }
        })
      }
    })
  }

  goToUserDetail(dog){
    this.navCtrl.push(ListDogUserPage, { id: dog.usuarioid, userName: dog.usuarionombre });
  }

  goToServDetail(dog){
    console.log('localid',dog.localid);
    this.api.getLocalData(dog.localid).subscribe(x=>{
      console.log('xLocaliid',x);
      this.navCtrl.push(ServiceDetailPage,{serv:x['data']});
    })
  }

  goToDogDetail(dog){
    this.api.getDogData(dog.perroid).subscribe(x=>{
      console.log('perro',x);
      if(x['data'].length > 0){
        if(x['data'][0]['estado'] != 5){
          this.navCtrl.push(PhotoSliderPage,{dogDetail: x['data'][0]})
        }else{
          this.navCtrl.push(PerfilCallejeritoPage,{dogDetail: x['data'][0]})
        }
      }
    })
  }

}
