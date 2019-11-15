import { PerfilCallejeritoPage } from './../perfil-callejerito/perfil-callejerito';
import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the QrCollaresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-qr-collares',
  templateUrl: 'qr-collares.html',
})
export class QrCollaresPage {

  dogScan: any = null;
  url: string = "https://ctrlztest.com.ar/lupacan/apirest/";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    private barcodeScanner: BarcodeScanner,
    public loadingCtrl: LoadingController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrCollaresPage');
  }

  getItems(ev: any) {
    let val = ev.target.value;
    console.log("val", val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '' && val.length > 1) {
      this.api.scanCodeCollar(val).subscribe(x => {
        console.log('VUELTA_API_scanCodeCollar', x);
        if (x['data'].length > 0) {
          this.dogScan = x['data'][0];
          console.log('dogScan', this.dogScan);
        }else{
          this.dogScan = null;
        }
      })
    } else {
      this.dogScan = null;
      /* this.items = [];
      this.mostarUsuarios = this.mostrarPerros = this.mostrarLocales = false; */
    }
  }

  goToIntDog(dogScan) {
    if(dogScan.estado != '5'){
      this.navCtrl.push(PhotoSliderPage, { dogDetail: dogScan });
    }else{
      this.navCtrl.push(PerfilCallejeritoPage, {dogDetail: dogScan})
    }
  }


  scanCode() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Espere por favor...'
    });
    loading.present();
    this.barcodeScanner.scan({
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: false, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      prompt: "Coloque el código de QR dentro del área de escaneo", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: false // iOS and Android
    }).then(barcodeData => {
      console.log('data', barcodeData);
      if (barcodeData.text != "") {
        this.api.scanCodeCollar(barcodeData.text).subscribe(x => {
          console.log('VUELTA_API_scanCodeCollar', x);
          if (x['data'].length > 0) {
            this.dogScan = x['data'][0];
            console.log('dogScan', this.dogScan);
            loading.dismiss();
            if(this.dogScan.estado != '5'){
              this.navCtrl.push(PhotoSliderPage, { dogDetail: this.dogScan });
            }else{
              this.navCtrl.push(PerfilCallejeritoPage, {dogDetail: this.dogScan})
            }
          }
        })
      }
    }).catch((err) => {
      // This seems to happen only when the "back" button is pressed
      //this.showCancelledAlert();
      loading.dismiss();      
      console.log('erro', err);
    });
    loading.dismiss();      
  }

}
