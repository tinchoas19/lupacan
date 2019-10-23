import { MenuPage } from './../menu/menu';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-transferencia',
  templateUrl: 'transferencia.html',
})
export class TransferenciaPage {
  dataDog: any = null;
  index:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider,
    public loadingCtrl: LoadingController,
    public toastController: ToastController
  ) {
    this.dataDog = this.navParams.data.dogDetail;
    this.index = this.navParams.data.index || 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransferenciaPage');
    console.log('dataDog', this.dataDog);
  }

  acepta() {
    let tipo = 'transferencia';
    let respuesta = "aceptado";    
    const loader = this.loadingCtrl.create({
      content: "Espere por favor..",
      spinner: "circles"
    });
    loader.present();
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.api.transferirPerro(val.usuarioid, this.dataDog.perroid, tipo, respuesta).subscribe(data => {
          console.log('vuleta_trans', data);
          if (JSON.parse(data['_body'])['data'] == 'inserted') {
            this.presentToasteEx();
            loader.dismiss();
            this.navCtrl.setRoot(MenuPage);
          } else {
            loader.dismiss();
            this.presentToasteErr();
            this.navCtrl.setRoot(MenuPage);
          }
        })
      } else {
        loader.dismiss();
        this.presentToasteErr();
      }
    })
  }

  rechaza() {
    let tipo = 'transferencia';
    let respuesta = "rechazado";
    const loader = this.loadingCtrl.create({
      content: "Espere por favor..",
      spinner: "circles"
    });
    loader.present();
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.api.transferirPerro(val.usuarioid, this.dataDog.perroid, tipo, respuesta).subscribe(data => {
          console.log('vuleta_trans', data);
          if (JSON.parse(data['_body'])['data'] == 'inserted') {
            this.presentToasteRe();
            loader.dismiss();
            this.navCtrl.setRoot(MenuPage);
          } else {
            loader.dismiss();
            this.presentToasteErr();
            this.navCtrl.setRoot(MenuPage);            
          }
        })
      } else {
        loader.dismiss();
        this.presentToasteErr();
      }
    })
  }


  aceptaTenencia() {
    let tipo = 'tenencia';
    let respuesta = "aceptado";    
    const loader = this.loadingCtrl.create({
      content: "Espere por favor..",
      spinner: "circles"
    });
    loader.present();
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.api.transferirPerro(val.usuarioid, this.dataDog.perroid, tipo, respuesta).subscribe(data => {
          console.log('vuleta_trans', data);
          if (JSON.parse(data['_body'])['data'] == 'inserted') {
            this.presentToasteExTe();
            loader.dismiss();
            this.navCtrl.setRoot(MenuPage);            
          } else {
            loader.dismiss();
            this.presentToasteErr();
            this.navCtrl.setRoot(MenuPage);
          }
        })
      } else {
        loader.dismiss();
        this.presentToasteErr();
      }
    })
  }

  rechazaTenencia() {
    let tipo = 'tenencia';
    let respuesta = "rechazado";
    const loader = this.loadingCtrl.create({
      content: "Espere por favor..",
      spinner: "circles"
    });
    loader.present();
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.api.transferirPerro(val.usuarioid, this.dataDog.perroid, tipo, respuesta).subscribe(data => {
          console.log('vuleta_trans', data);
          if (JSON.parse(data['_body'])['data'] == 'inserted') {
            this.presentToasteRe();
            loader.dismiss();
            this.navCtrl.setRoot(MenuPage);
          } else {
            loader.dismiss();
            this.presentToasteErr();
            this.navCtrl.setRoot(MenuPage);            
          }
        })
      } else {
        loader.dismiss();
        this.presentToasteErr();
      }
    })
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Ahora " + this.dataDog.nombre + " es tu perro!.\n Feliciadades!!",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteExTe() {
    const toast = await this.toastController.create({
      message: "Listo!\n Ahora " + this.dataDog.nombre + " es también tu perro!.\n Feliciadades!!",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }


  async presentToasteRe() {
    const toast = await this.toastController.create({
      message: "Okey!\n Aquí no paso nada!",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteErr() {
    const toast = await this.toastController.create({
      message: "Uups!\n Hubo un error, vuelve a intentarlo.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
