import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-modal-callejerito',
  templateUrl: 'modal-callejerito.html',
})
export class ModalCallejeritoPage {

  dog: any;
  items: any;
  index: any;
  url: string = 'https://ctrlztest.com.ar/lupacan/apirest/';
  txt:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastController: ToastController,
    private api: ApiProvider,
    private storage: Storage,
  ) {
    this.dog = this.navParams.get('dog');
    this.index = this.navParams.get('index');
  }

  ionViewDidLoad() {
    console.log('dog', this.dog);
    console.log('index', this.index);
    console.log('ionViewDidLoad ModalCallejeritoPage');
  }

  ionViewWillEnter() {
    this.api.getBitacora(this.dog.perroid).subscribe(x => {
      this.items = x['data'];
      this.items.map(user => {
        if (user.facebookid != '') {
          user.imgSrc = "https://graph.facebook.com/" + user.facebookid + "/picture?type=large";
        } else {
          user.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + user['imagen'];
        }
      })
      console.log('dataBita', this.items);
    })
  }

  enviar(txt) {
    this.storage.get('datauser').then(val => {
      console.log('esc', txt);
      if (txt != '' && val != null) {
        this.api.addHistorial(val.usuarioid, this.dog, txt).subscribe(data => {
          console.log('vueltaData', data);
          let vuelta = JSON.parse(data['_body'])['data'];
          if (vuelta == 'inserted') {
            this.txt = '';
            this.add(this.dog);
            setTimeout(() => {
              this.ionViewWillEnter();
            }, 200)
          }
        })
      }
    })
  }

  cerrar() {
    //let result = "se cerró";
    this.viewCtrl.dismiss();
  }

  async add(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Se agrego tu comentario\n al historial de " + dog.nombre,
      duration: 3000,
      showCloseButton: true,
      cssClass: 'toastExito',
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }


}
