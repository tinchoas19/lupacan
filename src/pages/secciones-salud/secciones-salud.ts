import { ApiProvider } from './../../providers/api/api';
import { ModalSaludPage } from './../modal-salud/modal-salud';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-secciones-salud',
  templateUrl: 'secciones-salud.html',
})
export class SeccionesSaludPage {
  recordatorio: boolean = false;
  descripcion: string;
  title: string;
  index:any;
  dog:any;
  itemSalud:any = null;
  itemTrata:any = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private api: ApiProvider
  ) {
    this.index = this.navParams.data.index || 0;
    this.dog = this.navParams.get('dog');
    console.log('index', this.index);
    this.controlSecc(this.index);
  }

  ionViewWillEnter(){
    this.api.getSalud(this.dog.perroid).subscribe(x=>{
      console.log('data',x);
      this.itemSalud = x['data']['vacunas'];
      this.itemTrata = x['data']['tratamientos'];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SeccionesSaludPage');
  }

  controlSecc(index){
    if(index === 0){
      this.title = 'Vacunación';
      this.descripcion = 'En esta sección podes cargar las vacunas que ya le diste a tu mascotas, además podes crear recordatorios para que te avisemos cuando darle la sieguiente.'
    }else if(index === 1){
      this.title = "Tratamientos";
      this.descripcion = 'En esta sección podes cargar los tratamientos que estes realizando con tu mascota y deba tener un seguimiento regular.'
    }else if(index === 2){
      this.title = "Alergias";
      this.descripcion = 'En esta sección podrás registrar todas las alergias que tuvo o tiene tu mascota.'
    }else if(index === 3){
      this.title = "Cirugías";
      this.descripcion = 'En esta sección podrás registrar todas las cirugías que tuvo o va a tener tu mascota.'
    }else if(index === 4){
      this.title = "Enfermedades";
      this.descripcion = 'En esta sección podrás registrar todas las enfermedades que tuvo o tiene tu mascota.'
    }else if(index === 5){
      this.title = "Visitas al veterinario";
      this.descripcion = 'En esta sección podrás registrar todas las enfermedades que tuvo o tiene tu mascota.'
      this.recordatorio = true;
    }
  }

  openModal(title){
    let profileModal = this.modalCtrl.create(ModalSaludPage, { title: title, dog: this.dog });
    profileModal.onDidDismiss(data => {
      this.ionViewWillEnter();
    });
    profileModal.present();
  }

}
