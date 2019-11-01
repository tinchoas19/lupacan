import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ToastController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from "@ionic-native/in-app-browser";

@Component({
  selector: 'page-slide-premium',
  templateUrl: 'slide-premium.html',
})
export class SlidePremiumPage {
  @ViewChild(Slides) slides: Slides;
  muestraBtn: boolean = false;
  valorEntrada: any = 5000;
  imgSrc: any;
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
  localid: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    private storage: Storage,
    private iab: InAppBrowser,
    public toastController: ToastController
  ) {
    this.localid = this.navParams.data['localid'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidePremiumPage');
  }

  slideChanged() {
    if (this.slides.isEnd()) {
      this.muestraBtn = true;
    } else {
      this.muestraBtn = false;
    }
  }

  salir() {
    this.navCtrl.pop();
  }

  goToHome() {
    //this.navCtrl.setRoot(TabsPage);

  }

  // ***********************************************************
  // ---------------- CIFRADO DE CHECKOUT
  // ***********************************************************
  web: string = "http://ctrlztest.com.ar/lupacan/mercadopago/?";

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
            /* this.api.localPremium(this.localid).subscribe(x => {
              console.log('x_vuelta_premium', x);
              alert('Compra Success');
            }); */
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

  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Hubo un error!\n Vuleve a intentarlo.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Bienvenido a LupaCan!",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
