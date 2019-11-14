import { LoginPage } from './../login/login';
import { ApiProvider, usuario } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-recupero-pass',
  templateUrl: 'recupero-pass.html',
})
export class RecuperoPassPage {

  public myForm: FormGroup;
  public submitAttempt: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    private api: ApiProvider
  ) {
    this.myForm = formBuilder.group({
      usuario:['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecuperoPassPage');
  }

  recuperarPass(){
    const loader = this.loadingCtrl.create({
      content: "Espere por favor...",
    });
    if(!this.myForm.valid){
      this.submitAttempt = true;
      this.showAlert();
    }else{
      loader.present();
      this.submitAttempt = false;
      this.api.recuperoPass(this.myForm.value).subscribe(x=>{
        console.log('VUELTA_API_RECUPERO_PASS', x);
        let res = JSON.parse(x['_body'])['data'];
        if(res == 'Message sent!'){
          loader.dismiss();
          this.presentToasteEx();
          setTimeout(()=>{
            this.navCtrl.setRoot(LoginPage);
          },500)
        }else{
          this.presentToasteError(res);
          loader.dismiss();
        }
      })
    }
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Espere por favor...",
    });
    loader.present();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!",
      buttons: ["Ok"]
    });
    alert.present();
  }

  async presentToasteError(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration:3000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Se enviará un email a tu usuario.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
