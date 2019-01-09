import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PhotoSliderPage } from '../photo-slider/photo-slider';


@IonicPage()
@Component({
  selector: 'page-dog',
  templateUrl: 'dog.html',
})
export class DogPage {
  private dog: any[];
  public checkAsLost: boolean;
  public thisDogIsLost: boolean = false;
  public thisDogIsToBeAddopted: boolean = false;

  private pageId: number;
  public showMyControls: boolean;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.dog = this.navParams.data.dogDetail;
    this.showMyControls = this.navParams.data.isMyDogs;
    this.pageId = this.navParams.data.pageId;
    if (this.pageId == 2)
      this.thisDogIsLost = true;
    if (this.pageId == 4)
      this.thisDogIsToBeAddopted = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DogPage');
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Ya se publico como perdido. Junto a la comunidad lo vamos a encontrar.',
      buttons: ['OK']
    });
    if (this.checkAsLost) {
      alert.present();
    }
  }

  iFoundThisDog(dog) {
    const alert = this.alertCtrl.create({
      title: 'Perro encontrado!',
      subTitle: 'Estas seguro que vos tenes este perro? De ser asi le enviaremos tu email al duenio para que se pongan en contacto.',
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log("no");
          }
        },
        {
          text: 'Si',
          handler: data => {
            console.log("si");
          }
        }
      ]
    });

    alert.present();
    
  }

  goToSlider(dog){
    this.navCtrl.push(PhotoSliderPage, dog.imageCollection)
  }

  iWannaThisDog(dog){
    const alert = this.alertCtrl.create({
      title: 'Perro en adopcion!',
      subTitle: 'Estas seguro que desea adoptar este perro? De ser asi le enviaremos tu email al duenio para que se pongan en contacto.',
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log("no");
          }
        },
        {
          text: 'Si',
          handler: data => {
            console.log("si");
          }
        }
      ]
    });

    alert.present();
  }

}
