import { Badge } from '@ionic-native/badge';
import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-mis-notificaciones',
  templateUrl: 'mis-notificaciones.html',
})
export class MisNotificacionesPage {
  msj: boolean;
  notificaciones:any=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider,
    private badge: Badge
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MisNotificacionesPage');
  }

  ionViewWillEnter(){
    this.storage.get('datauser').then(user=>{
      if(user!=null){
        this.api.getNotificacionesUser(user['usuarioid']).subscribe(x=>{
          console.log('not', x);
          this.notificaciones = x['data'];
          this.badge.clear();
          if(this.notificaciones.length === 0){
            this.msj = true;
          }else{
            this.msj = false;
          }
        })
      }
    })
  }

}
