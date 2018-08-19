import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ServiPage } from "../servi/servi";
import { FeedPage } from "../feed/feed";
import { ProfileSettingsPage } from '../profile-settings/profile-settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public pagesData = [
    { id: 1, title: "Comunidad" },
    { id: 2, title: "Perdidos" },
    { id: 3, title: "Encontrados" },
    { id: 4, title: "Adopcion" }
  ]

  constructor(public navCtrl: NavController) {

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
}
