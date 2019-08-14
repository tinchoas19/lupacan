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
    private storage: Storage,
    private interval: IntervalProvider
  ) {
    this.interval.toggleInterval();
  }


  ionViewWillEnter(){
    this.storage.get('datauser').then(val=>{
      console.log('usuarioHome', val);
      if(val){
        this.usuario = val;
        this.imgSrc = "http://ctrlztest.com.ar/lupacan/apirest/"+val['imagen'];
      }
    })
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
