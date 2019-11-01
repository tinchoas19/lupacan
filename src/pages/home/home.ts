import { Badge } from '@ionic-native/badge';
import { ApiProvider } from './../../providers/api/api';
import { IntervalProvider } from './../../providers/interval/interval';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, AlertController, MenuController, NavParams } from 'ionic-angular';
import { ServiPage } from "../servi/servi";
import { FeedPage } from "../feed/feed";
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { AgregarPage } from '../agregar/agregar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  numberBadge: number;
  usuario:any = 0;
  imgSrc:any=null;
  public pagesData = [
    { id: 1, title: "Comunidad" },
    { id: 2, title: "Perdidos" },
    { id: 3, title: "Encontrados" },
    { id: 4, title: "Adopcion" }
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private badge: Badge,
    private storage: Storage,
    private api: ApiProvider,
    private interval: IntervalProvider
  ) {
  }


  ionViewWillEnter(){
    this.storage.get('datauser').then(val=>{
      console.log('usuarioHome', val);
      if(val){
        this.usuario = val;
        this.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/"+val['imagen'];
        this.api.getNotificacionesSinLeer(val['usuarioid']).subscribe(x=>{
          console.log('misNot',x['data']);
          let numberNot = Number(x['data']);
          console.log('misNot_Parse',numberNot);            
          this.badge.set(numberNot);
          this.numberBadge = numberNot;
        })
      }
    })
  }

  ionViewDidLoad(){
    this.interval.toggleInterval();    
  }

  openMenu() {
    this.menuCtrl.open();
  }
 
  closeMenu() {
    this.menuCtrl.close();
  }
 
  toggleMenu() {
    this.menuCtrl.toggle();
  }

  traerPublicidad(){
    /* this.api.getPublicidad("1").subscribe(x=>{
      console.log('publicidad',x);
    }) */
  }

  
  goToComunidad() {
    this.navCtrl.push(FeedPage,this.pagesData[0]);
  }
  goToPerdidos() {
    this.navCtrl.push(FeedPage,this.pagesData[1]);
  }
  goToEncontrar() {
    this.navCtrl.push(FeedPage,this.pagesData[2]);
  }
  goToAdopcion() {
    this.navCtrl.push(FeedPage,this.pagesData[3]);
  }
  goToServicios() {
    this.navCtrl.push(ServiPage);
  }
  goToMySettings() {
    this.navCtrl.push(ProfileSettingsPage);
  }
  goToAgregar() {
    this.navCtrl.push(AgregarPage);
  }
}
