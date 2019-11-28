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
  misPerros: any = [];
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

  estado(dog) {
    if (dog.estado == 2) {
      return 'Está Perdido';
    } else if (dog.estado == 3) {
      return 'Fue Encontrado'
    } else if (dog.estado == 4) {
      return 'Está en Adopción'
    }else if (dog.estado == 5) {
      return 'Es un Callejerito'
    } else {
      return 'Es mio y esta en Casa';
    }
  }

  ionViewWillEnter() {
    this.misPerros = this.myDogs = this.myCalle = [];
    this.storage.get('datauser').then(val => {
      this.ApiProvider.getMyDogs(val['usuarioid']).subscribe(data => {
        console.log(data, 'sarasaaa');
        this.myDogs = data["data"];
        this.myCalle = this.myDogs.filter(dog=>{
          return dog.estado == '5';
        })
        this.misPerros = this.myDogs.filter(dog=>{
          return dog.estado != '5';
        })
        console.log('calle', this.myCalle);
        console.log('misPerros', this.misPerros);
      });

    })
  }


  darEnAdopcion(dog) {
    if(dog.estado != '5'){
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
    }else{
      this.error2();
    }
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

  goToIntCalle(dog, i){
    this.navCtrl.push(PerfilCallejeritoPage,{dogDetail:dog,index:i})
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
      message: "Listo!\n Nos encargaremos de encontrarle\n un nuevo hogar a " + dog.nombre,
      duration: 3000,
      showCloseButton: true,
      cssClass: 'toastExito',
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
      cssClass: 'toastError',
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async error2() {
    const toast = await this.toastController.create({
      message: "Ups!\n Tu perro está perdido!",
      duration: 3000,
      showCloseButton: true,
      cssClass: 'toastError',
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
