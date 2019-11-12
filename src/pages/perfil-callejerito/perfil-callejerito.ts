import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ToastController, ModalController, AlertController } from 'ionic-angular';
import { ModalCallejeritoPage } from '../modal-callejerito/modal-callejerito';
import { MyDogsPage } from '../my-dogs/my-dogs';
import { BuscarUsuariosPage } from '../buscar-usuarios/buscar-usuarios';


@Component({
  selector: 'page-perfil-callejerito',
  templateUrl: 'perfil-callejerito.html',
})
export class PerfilCallejeritoPage {
  index:any;
  dog: any;
  @ViewChild('slideWithNav2') slideWithNav2: Slides;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastController: ToastController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private api: ApiProvider,
    private storage: Storage
  ) {
    this.dog = this.navParams.data.dogDetail;
    this.index = this.navParams.get('index') ? this.navParams.get('index') : 0;
  }

  next() {
    this.slideWithNav2.slideNext(500);
  }

  prev() {
    this.slideWithNav2.slidePrev(500);
  }

  //EstadoDog
  estado(dog) {
    if (dog.estado == 2) {
      return 'Perdido';
    } else if (dog.estado == 3) {
      return 'Encontrado'
    } else if (dog.estado == 4) {
      return 'En Adopción'
    }else if (dog.estado == 5) {
      return 'Callejerito'
    } else {
      return 'En Casa';
    }
  }

  openModal(dog, i) {
    const profileModal = this.modalCtrl.create(ModalCallejeritoPage, { dog: dog, index: i });
    profileModal.onDidDismiss(data => {
      console.log(data);
    });
    profileModal.present();
  }

  pedirTenencia(dog){
    this.storage.get('datauser').then(val=>{
      if(val!=null){
        this.api.pedirTenenciaCalle(val['usuarioid'], dog.perroid).subscribe(x=>{
          console.log('vueltaTenencia', x);
          let vuelta = JSON.parse(x['_body'])['data'];
          if(vuelta == 'inserted'){
            this.tenencia(this.dog);
          }
        })
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilCallejeritoPage');
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

  async tenencia(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Nos encargaremos de avisarle\n a"+dog.usuarionombre+" que\n deseas tener la tenencia también\n de"+dog.nombre,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
