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

  usuario:any;
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
    private storage: Storage
  ) {
  }
  ionViewWillEnter(){
    this.storage.get('usuario').then(val=>{
      console.log('usuarioHome', val);
      if(val){
        this.imgSrc = "http://ctrlztest.com.ar/lupacan/apirest/"+val['imagen'];
      }
    })
  }
/* 
  alertMision(){
    const alert = this.alertCtrl.create({
      title: 'NUESTRA MISIÓN',
      subTitle: 'BUSCAR PERROS PERDIDOS Y AYUDAR A ENCONTRARLES UN HOGAR A LOS QUE NO LO TIENEN, CON LA PARTICIPACIÓN ACTIVA DE LOS MIEMBROS DE LA COMUNIDAD',
      buttons: ['OK']
    });
    alert.present();
  } */

  /* ionViewWillEnter(){
    
  } */
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
