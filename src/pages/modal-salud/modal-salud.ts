import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar'

@Component({
  selector: 'page-modal-salud',
  templateUrl: 'modal-salud.html',
})
export class ModalSaludPage {
  title: any;
  dog:any;
  nameVacuna: any;
  vacunas: any;
  recordatorio: boolean;
  fechaAlarm: any;
  fechaVacuna:any;
  fechaTratamiento:any;
  notaAlarm: any;
  fechaTratamientoAlarm: any;
  fechaTratamientoVacuna:any;
  notaTratamientoAlarm: any;
  vacuna: any;
  tratamiento:any
  calendars = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public toastController: ToastController,
    public calendar: Calendar,
    private api: ApiProvider
  ) {
    this.dog = this.navParams.get('dog');
    this.title = this.navParams.get('title');
    console.log('title',this.title);
    
  }

  changeVac(vacuna){
    this.vacunas.map(vac=>{
      if(vacuna == vac.vacunaid){
        this.nameVacuna = vac.nombre;
      }
    })
  }

  ionViewWillEnter() {
    this.calendar.requestWritePermission();
    this.api.getVacunas().subscribe(x => {
      console.log('vac', x);
      this.vacunas = x['data']['vacunas'];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalSaludPage');
  }

  cerrar() {
    let result = "se cerró";
    this.viewCtrl.dismiss({ result: result });
  }

  createVacunaApi(){
    if(this.title == 'Vacunación'){
      this.api.addVacuna(new Date(this.fechaVacuna), this.dog.perroid, this.vacuna).subscribe(x=>{
        console.log('x',x);
        let vuelta = JSON.parse(x['_body'])['data'];
        if(vuelta == 'inserted'){
          this.addVacuna(this.dog);
          this.guardar();
          this.viewCtrl.dismiss();
        }else{
          alert('Hubo un error => Vacuna add DB');
        }
      })
    }else{
      this.api.addTratamiento(new Date(this.fechaTratamiento), this.dog.perroid, this.tratamiento).subscribe(x=>{
        console.log('x',x);
        let vuelta = JSON.parse(x['_body'])['data'];
        if(vuelta == 'inserted'){
          this.addTrata(this.dog);
          this.guardarTrata();
          this.viewCtrl.dismiss();
        }else{
          alert('Hubo un error => Tratamiento add DB');
        }
      })
    }
  }

  guardar() {
    if (this.recordatorio) {
      var fecha = new Date(this.fechaAlarm.replace(/-/g, "/"));
      console.log('fecha', fecha);
      console.log('vacunName', this.nameVacuna);      
      this.calendar.createEventInteractivelyWithOptions(this.nameVacuna,"Buenos aires", this.notaAlarm, new Date(this.fechaAlarm), new Date(this.fechaAlarm)).then(res => {
        console.log('res',res);
      }, err => {
        console.log('err: ', err);
      });
    //let result = "se guardó";
    //this.viewCtrl.dismiss({result:result});
    }
  }

  guardarTrata() {
    if (this.recordatorio) {
      var fecha = new Date(this.fechaTratamientoAlarm.replace(/-/g, "/"));
      console.log('fecha', fecha);
      console.log('vacunName', this.tratamiento);      
      this.calendar.createEventInteractivelyWithOptions(this.tratamiento, "Buenos aires", this.notaTratamientoAlarm, new Date(this.fechaTratamientoAlarm), new Date(this.fechaTratamientoAlarm)).then(res => {
        console.log('res',res);
      }, err => {
        console.log('err: ', err);
      });
    //let result = "se guardó";
    //this.viewCtrl.dismiss({result:result});
    }
  }

  async addVacuna(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Se agrego una vacuna\n de " + dog.nombre,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async addTrata(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Se agrego una tratamiento nuevo\n de " + dog.nombre,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
