import { MisionPage } from './../mision/mision';
import { GoogleMapsProvider } from './../../providers/google-maps/google-maps';
import { Storage } from '@ionic/storage';
import { ApiProvider, usuario } from './../../providers/api/api';
import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, ViewController, ModalController, Select } from "ionic-angular";
import { HomePage } from "../home/home";
import { LoadingController, ToastController } from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";
import { Geolocation } from '@ionic-native/geolocation';
//import { GoogleMaps } from '../../providers/google-maps';

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { Camera, CameraOptions } from "@ionic-native/camera";

declare var google: any;

@IonicPage()
@Component({
  selector: "page-add-dog",
  templateUrl: "add-dog.html"
})
export class AddDogPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  @ViewChild('mySelect') selectRef: Select;
  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;

  dog: any = {
    usuarioid: '',
    nombre: '',
    nacimiento: '',
    gender: '',
    esterilizado:'',
    raza: '',
    color: '',
    descripcion: '',
    direccion:'',
    placeid:'',
    codigo: '',
    estadodireccion: '',
    estadoplaceid:'',
    estadofecha:''
  };
  perroRefugio:boolean;
  refugioid:any;
  selectRaza : string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public zone: NgZone,
    public maps: GoogleMapsProvider,
    public platform: Platform, 
    public geolocation: Geolocation, 
    public viewCtrl: ViewController,
    private services: ApiProvider,
    private storage: Storage,
    public modalCtrl: ModalController,
    private DomSanitizer: DomSanitizer
  ) {
    this.selectRaza = 'Seleccionar'
    this.navParams.data.refugio ? this.perroRefugio = true : this.perroRefugio = false;
    this.navParams.data.refugioid ? this.refugioid = this.navParams.data.refugioid : this.refugioid = null;
    console.log('this.refugioid', this.navParams.data.refugioid);
    this.searchDisabled = true;
    this.saveDisabled = true;
    this.initializeItems();
  }

  onAccountTypeChange(){
    this.query = "";
  }

  searchQuery: string = "";
  lugares: string[];
  razas: any = [];
  colores: any = [];
  msgError: any;
  dataCreate: any = [];

  initializeItems() {
    this.storage.get('datauser').then(x => {
      if (x) this.dog['usuarioid'] = x['usuarioid'];
      console.log('ja', this.dog.usuarioid)
    })
    this.services.getBreed().subscribe(data => {
      console.log('raza', data);
      this.razas = data['data']['colores'];
      this.colores = data['data']['razas'];
    })
    this.lugares = ["Amsterdam", "Bogota", "Buenos Aires"];
  }

  ionViewDidLoad(): void {
    console.log("ionViewDidLoad AddDogPage");

    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
    });
  }

  presentModal() {
    this.selectRef.close();
    const modal = this.modalCtrl.create(MisionPage);
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if(data){
        this.selectRaza = data.nombre
        this.dog.raza = data.razaid;
      }else this.selectRaza = 'Seleccionar';
      console.log('dog', this.dog);
    });
  }

  selectPlace(place) {
    console.log('place', place);
    if(this.dog.estado == '2' || this.dog.estado == '5'){
      this.dog.direccion = this.dog.placeid = "";
      this.dog.estadodireccion = place.description;
      this.dog.estadoplaceid = place.place_id;
    }else{
      this.dog.estadodireccion = this.dog.estadoplaceid = "";
      this.query = place.description;
      this.dog.direccion = place.description;
      this.dog.placeid = place.place_id
    }
    this.places = [];
    let location = {
      lat: null,
      lng: null,
      name: place.description
    };
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      this.zone.run(() => {
        var icon = {
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        this.saveDisabled = false;
        this.maps.map.setCenter({ lat: location.lat, lng: location.lng });
        var marker = new google.maps.Marker({
          map: this.maps.map,
          icon: icon,
          title: place.description,
          position: { lat: location.lat, lng: location.lng }
        });
        this.location = location;
      });
    });
  }

  
  searchPlace(){
    this.saveDisabled = true;
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

  save(){
    this.viewCtrl.dismiss(this.location);
  }

  close(){
      this.viewCtrl.dismiss();
  }   


  irAAgregar() {
    this.navCtrl.push(AddDogPage);
  }

  agregarFoto() { }

  irAHome() {
    console.log('dog', this.dog);
    console.log('fotos', this.galleryDog.length);
    if (this.validacion()) {
      let loading = this.loadingCtrl.create({
        spinner: 'circles',
        content: 'Espere por favor...'
      });
    
      loading.present();
      this.services.createDog(this.dog, this.galleryDog).subscribe(x => {
        console.log('createDog', x);
        this.dataCreate = JSON.parse(x['_body'])['data'];
        if (this.dataCreate == 'inserted') {
          loading.dismiss();
          this.msgError = 'Se agrego con Exito!'
          this, this.presentToast(this.msgError);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 2000)
        } else {
          loading.dismiss();
          this.msgError = 'Hubo un error, vuelve a intentarlo mas tarde...'
          this, this.presentToast(this.msgError);
        }
      })
    } else {
      this.presentToast(this.msgError);
    }
  }

  addDogRefugio(){
    console.log('dog', this.dog);
    console.log('refugioid', this.refugioid);
    if (this.validacion()) {
      this.services.addDogRefugio(this.dog, this.galleryDog, this.refugioid).subscribe(x => {
        console.log('createDog', x);
        this.dataCreate = JSON.parse(x['_body'])['data'];
        if (this.dataCreate == 'inserted') {
          this.msgError = 'Se agrego con Exito!'
          this, this.presentToast(this.msgError);
          setTimeout(() => {
            this.navCtrl.pop();
          }, 2000)
        } else {
          this.msgError = 'Hubo un error, vuelve a intentarlo mas tarde...'
          this.presentToast(this.msgError);
        }
      })
    } else {
      this.presentToast(this.msgError);
    }
  }

  validacion() {
    let ret = true;
    let msg = "";
    if(this.dog.estado != '5' || this.dog.estado != '2'){
      if (this.dog.nombre == "") {
        ret = false;
        msg += "Debe completar el nombre \n";
      }
      if (this.dog.nacimiento == "") {
        ret = false;
        msg += "Debe completar la fecha de nacimiento \n";
      }
      if (this.dog.gender == "") {
        ret = false;
        msg += "Debe escoger un género \n";
      }
      if (this.dog.raza == "") {
        ret = false;
        msg += "Debe escoger una raza \n";
      }
      if (this.dog.color == "") {
        ret = false;
        msg += "Debe completar su color \n";
      }
      if (this.dog.descripcion == "") {
        ret = false;
        msg += "Debe completar la descripción \n";
      }
      if (this.dog.direccion == "") {
        ret = false;
        msg += "Debe completar una dirección \n";
      }
      if (this.galleryDog.length === 0) {
        ret = false;
        msg += "Por favor nos gustaria que agregues una foto \n";
      }
      this.msgError = msg;
      return ret;

    }else if(this.dog.estado == '5'){
      if (this.dog.codigo == "") {
        ret = false;
        msg += "Debe ingresar el código del collar\n";
      }
      if (this.dog.nombre == "") {
        ret = false;
        msg += "Debe agregarle un nombre \n";
      }
      if (this.dog.gender == "") {
        ret = false;
        msg += "Debe escoger un género \n";
      }
      if (this.dog.raza == "") {
        ret = false;
        msg += "Debe escoger una raza \n";
      }
      if (this.dog.color == "") {
        ret = false;
        msg += "Debe completar su color \n";
      }
      if (this.dog.descripcion == "") {
        ret = false;
        msg += "Debe completar la descripción \n";
      }
      if (this.dog.estadodireccion == "") {
        ret = false;
        msg += "Debe completar una dirección \n";
      }
      if (this.galleryDog.length === 0) {
        ret = false;
        msg += "Por favor nos gustaria que agregues una foto \n";
      }
      this.msgError = msg;
      return ret;
    }else if(this.dog.estado == '2'){
      if (this.dog.nombre == "") {
        ret = false;
        msg += "Debe agregarle un nombre \n";
      }
      if (this.dog.gender == "") {
        ret = false;
        msg += "Debe escoger un género \n";
      }
      if (this.dog.raza == "") {
        ret = false;
        msg += "Debe escoger una raza \n";
      }
      if (this.dog.color == "") {
        ret = false;
        msg += "Debe completar su color \n";
      }
      if (this.dog.descripcion == "") {
        ret = false;
        msg += "Debe completar la descripción \n";
      }
      if (this.dog.estadodireccion == "") {
        ret = false;
        msg += "Debe completar una dirección \n";
      }
      if (this.dog.estadofecha == "") {
        ret = false;
        msg += "Debe completar una dirección \n";
      }
      if (this.galleryDog.length === 0) {
        ret = false;
        msg += "Por favor nos gustaria que agregues una foto \n";
      }
      this.msgError = msg;
      return ret;
    }
  }

  // ************* SUBIR IMAGENES
  galleryDog: any = [];
  imageURI: any;
  img1:boolean=false;
  img2:boolean=false;
  img3:boolean=false;
  img4:boolean=false;
  img5:boolean=false;
  imageFileName1: any;
  imageFileName2: any;
  imageFileName3: any;
  imageFileName4: any;
  imageFileName5: any;

  getImage(index) {
    const options = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      correctOrientation: true,
      targetWidth: 400,
      targetHeight: 400
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        console.log("IMAGE DATA IS", imageData);
        switch(index){
          case 1:
            this.imageFileName1 = 'data:image/jpeg;base64,' + imageData;
            this.img1 = true;
            this.galleryDog.push(this.imageFileName1);
          break;
          case 2:
            this.imageFileName2 = 'data:image/jpeg;base64,' + imageData;
            this.img2 = true;
            this.galleryDog.push(this.imageFileName2);
          break;
          case 3:
            this.imageFileName3 = 'data:image/jpeg;base64,' + imageData;
            this.img3 = true;
            this.galleryDog.push(this.imageFileName3);
          break;
          case 4:
            this.imageFileName4 = 'data:image/jpeg;base64,' + imageData;
            this.img4 = true;
            this.galleryDog.push(this.imageFileName4);
          break;
          case 5:
            this.imageFileName5 = 'data:image/jpeg;base64,' + imageData;
            this.img5 = true;
            this.galleryDog.push(this.imageFileName5);
          break;
        }
        //this.uploadFile();
      })
      .catch(e => {
        console.log("Error while picking from gallery", e);
      });
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
}
