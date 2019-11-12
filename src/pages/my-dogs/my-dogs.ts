import { ModalCallejeritoPage } from './../modal-callejerito/modal-callejerito';
import { PerfilCallejeritoPage } from './../perfil-callejerito/perfil-callejerito';
import { BuscarUsuariosPage } from './../buscar-usuarios/buscar-usuarios';
import { SaludPage } from './../salud/salud';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, ModalController } from 'ionic-angular';
import { DogPage } from '../dog/dog';
import { AddDogPage } from '../add-dog/add-dog';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-my-dogs',
  templateUrl: 'my-dogs.html',
})
export class MyDogsPage {

  myCalle: any = [];
  myDogs: any = [];
  index: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private ApiProvider: ApiProvider,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    public modalCtrl: ModalController,
    private storage: Storage
  ) {
    this.index = navParams.data.index || 0;
  }

  ionViewWillEnter() {
    this.storage.get('datauser').then(val => {
      this.ApiProvider.getMyDogs(val['usuarioid']).subscribe(data => {
        console.log(data, 'sarasaaa');
        this.myDogs = data["data"];
        this.myDogs.map(dog => {
          if (dog.estado == '5') {
            this.myCalle.push(dog);
          }
        })
        console.log('calle', this.myCalle);
      });

    })
  }


  darEnAdopcion(dog) {
    const alert = this.alertCtrl.create({
      title: 'Dar en adopción!',
      subTitle: 'Estas seguro de dar en adopción a ' + dog.nombre + '?',
      buttons: [
        {
          text: 'No',
          role: 'Cancel'
        },
        {
          text: 'Si',
          handler: data => {
            this.ApiProvider.marcarenAdopcion(dog['usuarioid'], dog['perroid']).subscribe(x => {
              console.log('vueltamarcarEnCasa', x);
              let data = JSON.parse(x['_body'])['data'];
              console.log('data', data);
              if (data == 'updated') {
                this.adopcion(dog);
                /* this.ApiProvider.getDogData(dog['perroid']).subscribe(x => {
                  console.log('perroid', x);
                  this.dog = x['data'][0];
                }) */
              } else {
                this.error();
              }
            })
          }
        }
      ]
    });

    alert.present();

  }

  goToSalud(dog) {
    this.navCtrl.push(SaludPage, { dog: dog });
  }

  addTenencia(dog) {
    const alert = this.alertCtrl.create({
      title: 'Compartir tenencia!',
      subTitle: 'Estas seguro de compartir la tenecia de ' + dog.nombre + '?',
      buttons: [
        {
          text: 'No',
          role: 'Cancel'
        },
        {
          text: 'Si',
          handler: data => {
            this.navCtrl.push(BuscarUsuariosPage, { dogTransfer: dog, index: 1 })
          }
        }
      ]
    })
    alert.present();
  }

  openModal(dog, i) {
    const profileModal = this.modalCtrl.create(ModalCallejeritoPage, { dog: dog, index: i });
    profileModal.onDidDismiss(data => {
      console.log(data);
      //this.madalDismissData = JSON.stringify(data);
    });
    profileModal.present();
  }

  async adopcion(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Nos encargaremos de encontrarle un nuevo hogar a " + dog.nombre,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async error() {
    const toast = await this.toastController.create({
      message: "Ups!\n Algo no salió como esperabamos, vuelve a intentarlo!",
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDogsPage');
  }

  goToDogDetail(dog) {
    this.navCtrl.push(DogPage, { dogDetail: dog, isMyDogs: true });
  }

  addNewDog() {
    this.navCtrl.push(AddDogPage);
  }
}
