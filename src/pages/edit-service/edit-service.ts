import { MyServicesPage } from './../my-services/my-services';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform, ToastController } from 'ionic-angular';
import { ModalOfferedServicesPage } from '../modal-offered-services/modal-offered-services';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { ServiceListPage } from '../service-list/service-list';


@IonicPage()
@Component({
  selector: 'page-edit-service',
  templateUrl: 'edit-service.html',
})
export class EditServicePage {
  private service: any;
  imagenes:any=[];
  imagePath:any;
  imageToEdit:any;
  base64Image:any;
  horariocierre:any;
  horarioapertura:any;  
  imagenEdit:boolean = true;
  private win: any = window;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController,
    private api:ApiProvider,
    public platform: Platform,
    private camera: Camera,
    public crop: Crop,
    private base64: Base64,
    public toastController: ToastController
  ) {
    this.service = this.navParams.data;
    console.log('service',this.service)
    this.imageToEdit =  "http://ctrlztest.com.ar/lupacan/apirest/"+this.navParams.data['fotos'][0]['imagen'];
    this.horarioapertura = this.service.horarioapertura;
    this,this.horariocierre = this.service.horariocierre;
    console.log('this.imageToEdit',this.imageToEdit);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditServicePage');
  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalOfferedServicesPage, characterNum);
    modal.present();
  }
  
  
  editService(){

  }


  deleteService(){
    this.showAlert();
  }
  
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Esta seguro que desea eliminar este servicio?',
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log("no");
          }
        },
        {
          text: 'Si',
          handler: data => {
            console.log("si");
            this.api.deleteLocal(this.service['localid']).subscribe(x=>{
              this.presentToasteEx();
            })
          }
        }
      ]
    });
   
      alert.present();
  
  }

  addPerfilPhoto(){
    const options = {
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true,
    };

    this.camera.getPicture(options)
    .then((fileUri) => {
      console.log('fileUri_camara', fileUri);
      // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
      // Only giving an android example as ionic-native camera has built in cropping ability
      if (this.platform.is('ios')) {
        return fileUri
      } else if (this.platform.is('android')) {
        // Modify fileUri format, may not always be necessary
        fileUri = 'file://' + fileUri;

        /* Using cordova-plugin-crop starts here */
        this.cropPicture(fileUri);
      }
    })
  }

  toBase64(filePath) {
    this.base64.encodeFile(filePath).then((base64File: string) => {
      this.base64Image = base64File;
      this.imagenes.push(this.base64Image);
    });
  }

  getTrustImg(){
    console.log('fn_muestra', this.imagePath);
    if(this.imagePath != this.imageToEdit){
      let path = this.win.Ionic.WebView.convertFileSrc(this.imagePath);
      console.log('fn_muestra_path',path);
      return path;
    }else{
      return this.imagePath;
    }
  }

  cropPicture(path){
    console.log('path_crop', path);
    let option={
      quality: 100,
      targetHeight: 100,
      targetWidth: 100
    };

    this.crop.crop(path, option).then(newImageCrop=>{
     this.imagePath = newImageCrop;
     console.log('imagen_cropeanda', newImageCrop);
     this.toBase64(this.imagePath);
     this.imagenEdit=false;
    },error=>{
      console.log('error_Crop', error );
    })
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Se borró de tu cuenta!",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
    const startIndex = this.navCtrl.getActive().index - 1;
    this.navCtrl.remove(startIndex, 1);
    this.navCtrl.pop();
  }
}
