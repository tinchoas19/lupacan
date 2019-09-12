import { ApiProvider } from './../../providers/api/api';
import { FormularioPublicitarPage } from './../formulario-publicitar/formulario-publicitar';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';


@Component({
  selector: 'page-publicitar',
  templateUrl: 'publicitar.html',
})
export class PublicitarPage {

  paquetes:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private api : ApiProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicitarPage');
  }

  goTopaqueteCiudad(paq){
    const modal = this.modalCtrl.create(FormularioPublicitarPage, { paq: paq });
    modal.onDidDismiss(data => {
      console.log('vueltaModal',data);
    });
    modal.present();
  }

  ionViewWillEnter(){
    this.api.getPaquetesPublicidad().subscribe(data=>{
      console.log('dataPaquetes', data);
      if(data['data']){
        this.paquetes = data['data'];
      }
    })
  }
}


