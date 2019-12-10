import { BuscarUsuariosPage } from './../buscar-usuarios/buscar-usuarios';
import { EditDogUserPage } from './../edit-dog-user/edit-dog-user';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Slides, LoadingController } from 'ionic-angular';
import { PhotoSliderPage } from '../photo-slider/photo-slider';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { ApiProvider } from '../../providers/api/api';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-dog',
  templateUrl: 'dog.html',
})
export class DogPage {
  dogScan: any;
  checkEnCasa: boolean;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  @ViewChild('slideWithNav2') slideWithNav2: Slides;
  private dog: any = [];
  public checkAsLost: boolean;
  public thisDogIsLost: boolean = false;
  public thisDogIsToBeAddopted: boolean = false;
  perdido_fecha: String = new Date().toISOString();
  perdido_en: String = 'Av. Los Incas 5150';
  private pageId: number;
  public showMyControls: boolean;
  placesService: any;
  relationship: string;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  dogId: any;
  query: string = '';
  places: any = [];
  autocompleteService: any;
  locationUser: any = { lat: '', lng: '' };
  otherLocation = {
    lat: null,
    lng: null
  }
  placeidPerdido: any;
  otraUbicacion:boolean=false;
  miUbicacion:boolean=false;  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private photoViewer: PhotoViewer,
    public alertCtrl: AlertController,
    public maps: GoogleMapsProvider,
    private geo: Geolocation,
    public zone: NgZone,
    private storage: Storage,
    private api: ApiProvider,
    public toastController: ToastController,
    private barcodeScanner: BarcodeScanner,
    public loadingCtrl: LoadingController,
  ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
  }

  //Position
  getCurrentPosition() {
    this.geo.getCurrentPosition().then((pos) => {
      this.locationUser.lat = pos.coords.latitude;
      this.locationUser.lng = pos.coords.longitude;
      console.log('position', this.locationUser);
      this.getPlaceid(this.dog['usuarioid'], this.dog['perroid'], pos.coords.latitude, pos.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  //Fullscreeen
  showImg(url) {
    console.log(url);
    this.photoViewer.show('https://ctrlztest.com.ar/lupacan/apirest/upload/10-1.jpg', 'My Dog', { share: false });
  }

  next() {
    this.slideWithNav2.slideNext(500);
  }

  prev() {
    this.slideWithNav2.slidePrev(500);
  }

  edad(FechaNacimiento) {

    var fechaNace: any = new Date(FechaNacimiento);
    var fechaActual: any = new Date()

    var mes = fechaActual.getMonth();
    var dia = fechaActual.getDate();
    var año = fechaActual.getFullYear();

    fechaActual.setDate(dia);
    fechaActual.setMonth(mes);
    fechaActual.setFullYear(año);

    let edad = Math.floor(((fechaActual - fechaNace) / (1000 * 60 * 60 * 24) / 365));

    return edad;
  }

  //EstadoDog
  estado(dog) {
    if (dog.estado == 2) {
      return 'Perdido';
    } else if (dog.estado == 3) {
      return 'Encontrado'
    } else {
      return 'En Casa';
    }
  }

  ionViewWillEnter() {
    if (this.navParams.data.dogDetail) {
      this.dog = this.navParams.data.dogDetail;
    } else {
      this.dogId = this.navParams.data.perroid;
      this.api.getDogData(this.dogId).subscribe(x => {
        console.log('perroid', x);
        this.dog = x['data'];
        
      })
      
    }
    this.dog.edad = this.edad(this.dog.fechanacimiento);
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
      if (this.dog['placeid'] != '') {
        this.selectPlace(this.dog['placeid']);
      } else {
        this.selectPlace(this.dog['estadoplaceid']);
      }
    });
    console.log('detail', this.dog);
    this.showMyControls = this.navParams.data.isMyDogs;
    this.pageId = this.navParams.data.pageId;
    if (this.pageId == 2)
      this.thisDogIsLost = true;
    if (this.pageId == 4)
      this.thisDogIsToBeAddopted = true;
  }

  goToEditDog() {
    this.navCtrl.push(EditDogUserPage, { dataDog: this.dog })
  }

  relacionarQr(dog){
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
        this.api.addCodigo(dog.perroid, barcodeData.text).subscribe(x => {
          console.log('VUELTA_API_scanCodeCollar', x);
          //let vuelta = JSON.parse(x['_body'])['data'];
          let vuelta = x['data'];
          if (vuelta == 'asignado') {
            this.asignado(dog);
            loading.dismiss();
          }else{

          }
        })
      }
    }).catch((err) => {
      // This seems to happen only when the "back" button is pressed
      //this.showCancelledAlert();
      loading.dismiss();      
      console.log('erro', err);
    });
  }

  ionViewDidLoad() {
    //console.log('detail', this.dog);
    console.log('ionViewDidLoad DogPage');
  }

  darEnAdopcion(dog){
    const alert = this.alertCtrl.create({
      title: 'Dar en adopción!',
      subTitle: 'Estas seguro de dar en adopción a ' + dog.nombre + '?',
      buttons: [
        {
          text: 'No',
          role: 'Cancel'
        },
        {
          text: 'Si',
          handler: data => {
            this.api.marcarenAdopcion(dog['usuarioid'], dog['perroid']).subscribe(x => {
              console.log('vueltamarcarEnCasa', x);
              let data = JSON.parse(x['_body'])['data'];
              console.log('data', data);
              if (data == 'updated') {
                this.api.getDogData(dog['perroid']).subscribe(x => {
                  console.log('perroid', x);
                  this.dog = x['data'][0];
                  this.adopcion(dog);
                })
              }else{
                this.existe();
              }
            })
          }
        }
      ]
    });

    alert.present();

  }

  selectPlace(placeid) {
    console.log('place', placeid);
    //this.places = [];
    let location = {
      lat: null,
      lng: null,
      name: this.dog.perrodireccion
    };
    this.placesService.getDetails({ placeId: placeid }, (details) => {
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
        this.location = location;
      });
    });
  }

  getPlaceid(usuarioid, perroid, latitude, longitude) {
    let loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();
    var geocoder = new google.maps.Geocoder();
    var latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    let placeid: any;
    let address: any;
    var self = this;
    geocoder.geocode({ 'location': latlng }, function (results, status) {
      console.log('relslsl', results);
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          console.log('ksjsjsjs', results[1].place_id);
          placeid = results[1].place_id;
          address = results[1].formatted_address;
          self.api.marcarDogPerdido(usuarioid, perroid, latitude, longitude, placeid, address).subscribe(x => {
            console.log('vueltaPerdido', x);
            let data = JSON.parse(x['_body'])['data'];
            console.log('data', data);
            if (data == 'updated') {
              self.checkAsLost = false;
              self.miUbicacion = false;
              self.otraUbicacion = false;
              self.otherLocation = null;
              self.otraUbicacion = null;
              self.relationship = null;
              loading.dismiss();
              self.presentToasteEx();
              self.api.getDogData(perroid).subscribe(x => {
                console.log('perroid', x);
                self.dog = x['data'][0];
              })
            }
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });

  }

  getPlace(place) {
    this.query = place.description;
    this.places = [];
    this.placeidPerdido = place.place_id;
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      console.log('detailaSAs', details);
      this.zone.run(() => {
        this.otherLocation.lat = details.geometry.location.lat();
        this.otherLocation.lng = details.geometry.location.lng();
      })
    })
    console.log('placeSlected', place);
  }

  newDogLocation(dog) {
    this.getPlaceid(dog['usuarioid'], dog['perroid'], this.otherLocation.lat, this.otherLocation.lng);
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

  showAlert() {
    this.storage.get('locatioUser').then(location => {
      console.log('loca', location);
      if (location != null) {
        this.getPlaceid(this.dog['usuarioid'], this.dog['perroid'], location['lat'], location['lng']);
      } else {
        this.getCurrentPosition();
      }
    })
  }

  enCasa(dog) {
    if(this.checkEnCasa){
      const alert = this.alertCtrl.create({
        title: 'Perro en casa!',
        subTitle: 'Estas seguro de estar con ' + dog.nombre + '?',
        buttons: [
          {
            text: 'No',
            role: 'Cancel',
            handler: data => {
              this.checkEnCasa = false;
            }
          },
          {
            text: 'Si',
            handler: data => {
              this.api.marcarEnCasa(dog['usuarioid'], dog['perroid']).subscribe(x => {
                console.log('vueltamarcarEnCasa', x);
                let data = JSON.parse(x['_body'])['data'];
                console.log('data', data);
                if (data == 'updated') {
                  this.api.getDogData(dog['perroid']).subscribe(x => {
                    console.log('perroid', x);
                    this.dog = x['data'][0];
                    this.perroCasa(dog);
                  })
                }
              })
            }
          }
        ]
      });
      alert.present();
    }
  }

  goToSlider(dog) {
    this.navCtrl.push(PhotoSliderPage, dog.imageCollection)
  }

  iWannaThisDog(dog) {
    const alert = this.alertCtrl.create({
      title: 'Perro en adopcion!',
      subTitle: 'Estas seguro que desea adoptar este perro? De ser asi le enviaremos tu email al duenio para que se pongan en contacto.',
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
          }
        }
      ]
    });

    alert.present();
  }

  transferir(dog){
    this.navCtrl.push(BuscarUsuariosPage,{dogTransfer:dog, index: 0});
  }

  async perroCasa(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Nos alegra que "+ dog.nombre+" se encuentre de vuelta con su dueño",
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async adopcion(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Nos encargaremos de encontrarle \n un nuevo hogar a "+ dog.nombre,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n No te preocupes ya avisamos a los usuarios de LupaCan cercanos a ti.",
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async asignado(dog) {
    const toast = await this.toastController.create({
      message: "Listo!\n Se asignamos el código con"+dog.nombre,
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async existe() {
    const toast = await this.toastController.create({
      message: "Uups!\n El código a relacionar ya existe!",
      duration: 3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }
}
