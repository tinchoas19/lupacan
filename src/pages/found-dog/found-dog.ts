import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GoogleMapsProvider } from "../../providers/google-maps/google-maps";
import { Camera } from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: "page-found-dog",
  templateUrl: "found-dog.html"
})
export class FoundDogPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  dog: any = {
    usuarioid: '',
    gender: '',
    descripcion: '',
    fecha: '',
    raza: '',
    color: '',
    size: '',
    direccion: '',
    placeid: ''
  };
  razas: any = [];
  colores: any = [];
  public myForm: FormGroup;
  public submitAttempt: boolean = false;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  mostrarMapa: boolean;
  msgError: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    private camera: Camera,
    public zone: NgZone,
    private services: ApiProvider,
    public maps: GoogleMapsProvider,
    private storage: Storage,
    private api: ApiProvider,
  ) {
    this.mostrarMapa = false;
    this.myForm = formBuilder.group({
      direccion: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      edad: ['', Validators.required],
    })
  }

  ionViewDidLoad() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
    });
    console.log("ionViewDidLoad FoundDogPage");
  }

  ionViewWillEnter() {
    this.get();
  }

  get() {
    this.services.getBreed().subscribe(data => {
      console.log('raza', data);
      this.razas = data['data']['colores'];
      this.colores = data['data']['razas'];
    })
  }

  selectPlace(place) {
    console.log('placeSlected', place);
    this.query = place.description;
    this.dog.direccion = place.description;
    this.dog.placeid = place.place_id;
    let location = {
      lat: null,
      lng: null,
      name: this.dog.perrodireccion
    };
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      console.log('details', details);
      this.zone.run(() => {
        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        this.saveDisabled = false;
        this.maps.map.setCenter({ lat: location.lat, lng: location.lng });
        var marker = new google.maps.Marker({
          map: this.maps.map,
          title: this.dog.perrodireccion,
          position: { lat: location.lat, lng: location.lng }
        });
        this.mostrarMapa = true;
        //this.locationDog = location;
        //console.log('location', this.locationDog);
      });
    });
    this.places = [];
  }

  searchPlace() {
    this.saveDisabled = true;
    console.log('query', this.query);
    if (this.query.length > 0 && !this.searchDisabled) {
      let config = {
        types: ['geocode'],
        input: this.query
      }
      console.log('query', this, this.query);
      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
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

  // ************* SUBIR IMAGENES
  galleryDog: any = [];
  imageURI: any;
  img1: boolean = false;
  img2: boolean = false;
  img3: boolean = false;
  imageFileName1: any;
  imageFileName2: any;
  imageFileName3: any;

  getImage(index) {
    const options = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
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
        switch (index) {
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
        }
        //this.uploadFile();
      })
      .catch(e => {
        console.log("Error while picking from gallery", e);
      });
  }

  validacion() {
    let ret = true;
    let msg = "";
    if (this.galleryDog.length == 0) {
      ret = false;
      msg += "Debe agregar al menos una foto \n";
    }
    if (this.dog.gender == "") {
      ret = false;
      msg += "Debe escoger un genero \n";
    }
    if (this.dog.raza == "") {
      ret = false;
      msg += "Debe escoger una raza \n";
    }
    if (this.dog.color == "") {
      ret = false;
      msg += "Debe completar su color \n";
    }
    if (this.dog.size == "") {
      ret = false;
      msg += "Debe escoger un tamaño \n";
    }

    this.msgError = msg;
    return ret;
  }

  publicar() {
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.dog.usuarioid = val['usuarioid'];
        this.submitAttempt = true;
        console.log(this.myForm.value);
        if (!this.myForm.valid && !this.validacion()) {
          this.presentToast(this.msgError);
        } else {
          this.dog.descripcion = this.myForm.value.direccion;
          this.dog.fecha = this.myForm.value.edad;
          console.log('dog',
            this.dog
          );
          console.log('fotos', this.galleryDog);
          this.api.addPerroEncontrado(this.dog, this.galleryDog).subscribe(x=>{
            console.log('x',x);
            this.msgError = 'Se agrego un nuevo perro encontrado. Gracias!';
            this.presentToast(this.msgError);
            this.navCtrl.pop();
          })
        }
      }
    })
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!",
      buttons: ["Ok"]
    });
    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }
}
