import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-formulario-publicitar',
  templateUrl: 'formulario-publicitar.html',
})
export class FormularioPublicitarPage {

  public myForm: FormGroup;
  public submitAttempt: boolean = false;
  url: string = "http://estareservado.ctrlztest.com.ar/"
  urlMP: any;
  options: InAppBrowserOptions = {
    location: "no", //Or 'no'
    hidden: "no", //Or  'yes'
    clearcache: "yes",
    clearsessioncache: "yes",
    zoom: "yes", //Android only ,shows browser zoom controls
    hardwareback: "yes",
    mediaPlaybackRequiresUserAction: "no",
    shouldPauseOnSuspend: "no", //Android only
    closebuttoncaption: "Close", //iOS only
    disallowoverscroll: "no", //iOS only
    toolbar: "yes", //iOS only
    enableViewportScale: "no", //iOS only
    allowInlineMediaPlayback: "no", //iOS only
    presentationstyle: "pagesheet", //iOS only
    fullscreen: "yes" //Windows only
  };
  paqueteSelected: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    private iab: InAppBrowser,
    public toastController: ToastController,
    private storage: Storage,
    private api: ApiProvider,
  ) {
    this.paqueteSelected = this.navParams.data.paq;
    console.log('paq', this.paqueteSelected);
    this.myForm = formBuilder.group({
      razon: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      telefono: ['', Validators.required],
      direcc: ['', Validators.required],//Contener letras y espacios, y tener menos de 30 caracteres.
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormularioPublicitarPage');
  }

  dismiss() {
    this.submitAttempt = true;
    if (!this.myForm.valid) {
      console.log("null!")
      //this.showAlert();
    } else {
      console.log("success!")
      console.log(this.myForm.value);
      this.checkout();
    }
  }

  // ***********************************************************
  // ---------------- CIFRADO DE CHECKOUT
  // ***********************************************************
  web: string = "http://ctrlztest.com.ar/lupacan/mercadopago/?";
  valorEntrada: any = this.navParams.data.paq.precio;
  priceParam: string = btoa("price=");
  priceAgain: string = "NgUhtRF";
  idParam: string = "ID";
  idNumber: string = "zLRTC";

  // var emailParam = btoa("email=");
  // let ecodeEmail = btoa("pepe@gmail.com");
  emailParam = btoa("email=");

  checkout() {
    this.storage.get('datauser').then(val => {
      if (val != null) {
        console.log('val', val);
        console.log('emial_comprador', val['email']);
        let ecodeEmail = btoa(val['email']);
        console.log('emial_hash', ecodeEmail);
        let money: any = btoa(this.valorEntrada);
        let moneyAgain: any = btoa(this.valorEntrada);
        this.urlMP =
          this.web +
          this.priceParam +
          "LzY63" +
          money +
          "&" +
          this.priceAgain +
          "LzY63" +
          moneyAgain +
          "&" +
          this.idParam +
          "LzY63" +
          this.idNumber +
          "&" +
          this.emailParam +
          "LzY63" +
          val['email'];
        let target = "_blank";
        console.log('URL_MP', this.urlMP);
        let browser = this.iab.create(this.urlMP, '_blank', this.options);
        browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
          console.log('event_mp', event);
          var okUrl = 'http://ctrlztest.com.ar/lupacan/mercadopago/thankyou.php';
          if (event.url == okUrl) {
            browser.close();//This will close InAppBrowser Automatically when closeUrl Started
            this.api.comprarPublicidad(this.myForm.value, this.paqueteSelected['paquetepublicidadid'], val['usuarioid'], this.paqueteSelected['precio']).subscribe(x => {
              console.log('x_comprarPublicidad', x);
              alert('Compra Success');
              this.viewCtrl.dismiss();
            });
          }
          var errorUrl = 'http://ctrlztest.com.ar/lupacan/mercadopago/errorpayment.php';
          if (event.url == errorUrl) {
            browser.close();//This will close InAppBrowser Automatically when closeUrl Started
            //alert('Compra Error');
          }
        });
      }
    })
  }

}
