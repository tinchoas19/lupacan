import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, ToastController } from 'ionic-angular';
import { ModalOfferedServicesPage } from '../modal-offered-services/modal-offered-services';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-create-service',
  templateUrl: 'create-service.html',
})
export class CreateServicePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  private win: any = window;
  tienda:any={
    nombre:"",
    direcc:"",
    telefono:"",
    horaA:"",
    horaC:"",
    category:"",
    usuarioid:"", 
    placeid:"",
  }
  imagenes:any=[];
  imagePath:any;
  base64Image:any;
  categorias:any=[];
  servicios:any=[]
  dataService:any=null;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    public modalCtrl: ModalController,
    public platform: Platform,
    private camera: Camera,
    public crop: Crop,
    public maps: GoogleMapsProvider,
    private base64: Base64,
    private storage: Storage,
    public toastController: ToastController,
  ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
    this.imagePath = "assets/imgs/vet.jpg";
  }


  ionViewWillEnter(){
    this.storage.get('usuario').then(val=>{
      if(val){
        this.tienda.usuarioid = val['usuarioid']
      }
    })
    this.getCateg();
  }
  
  openModal(characterNum) {
    let modal = this.modalCtrl.create(ModalOfferedServicesPage, characterNum);
    modal.present();
    modal.onDidDismiss((data) => {
      console.log('data', data);
      this.dataService = data;
      if(data.length > 0){
        data.map(serv=>{
          this.servicios.push(serv.servicioid);
          console.log('servicios', this.servicios);          
        })
      }
    });
  }

  getCateg(){
    this.api.getCategories().subscribe(cat=>{
      console.log('cat',cat);
      this.categorias = cat['data'];
    })
  }


  ionViewDidLoad() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
    });
    console.log('ionViewDidLoad CreateServicePage');
  }


  selectPlace(place){
    this.query = place.description;
    this.tienda.direcc = this.query;
    this.tienda.placeid = place.place_id
    console.log('placeSlected', place);  
  }

  addService(){
    let data;
    console.log('tienda', this.tienda);
    console.log('servSelec', this.servicios);
    console.log('imagene', this.imagenes);    
    this.api.createService(this.tienda, this.servicios, this.imagenes).subscribe(x=>{
      console.log('VUELTA_API_CREATESERVICE', x);
      data = JSON.parse(x['_body'])['data'];
      if(data != 'inserted'){
        this.presentToasteError();
      }else{
        this.presentToasteEx()
        setTimeout(()=>{
          this.navCtrl.pop()
        },500);
      }
    })
  }

  searchPlace(){
    this.saveDisabled = true;
    console.log('query', this.query);
    if(this.query.length > 0 && !this.searchDisabled) {
        let config = {
            types: ['geocode'],
            input: this.query
        }
        console.log('query', this,this.query);
        this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
            if(status == google.maps.places.PlacesServiceStatus.OK && predictions){
                this.places = [];
                predictions.forEach((prediction) => {
                    this.places.push(prediction);
                });
                console.log('places', this.places);
            }
        });
    } else {
        this.places = [];
    }
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
    if(this.imagePath != "assets/imgs/vet.jpg"){
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
    },error=>{
      console.log('error_Crop', error );
    })
  }


  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Hubo un error!\n Vuleve a intentarlo.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Se guardo tu registro.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
