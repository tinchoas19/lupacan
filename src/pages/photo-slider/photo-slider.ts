import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Geolocation } from '@ionic-native/geolocation';
import { ListDogUserPage } from './../list-dog-user/list-dog-user';
import { ChatPage } from './../chat/chat';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController, Slides } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { ProfileServiceUserPage } from '../profile-service-user/profile-service-user';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-photo-slider',
  templateUrl: 'photo-slider.html',
})
export class PhotoSliderPage {
  dataRefugio: any = null;
  distanciaAuto: any = "Calculando...";
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  @ViewChild('slideWithNav2') slideWithNav2: Slides;
  private dog: any = [];
  public checkAsLost: boolean;
  public thisDogIsLost: boolean = false;
  public thisDogIsToBeAddopted: boolean = false;
  map: any;
  private pageId: number;
  public showMyControls: boolean;
  userid: any;
  vuelta: boolean = true;
  isChecked: boolean;
  placesService: any;
  distanceService: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  locationUser: any = { lat: '', lng: '' };
  locationDog: any;
  perroMio: boolean = false;
  distanciaPerro: any = "Calculando...";
  query: string = '';
  places: any = [];
  otherLocation = {
    lat: null,
    lng: null
  }
  placeidPerdido: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private photoViewer: PhotoViewer,
    public modalCtrl: ModalController,
    private api: ApiProvider,
    public maps: GoogleMapsProvider,
    private geo: Geolocation,
    public zone: NgZone,
    private storage: Storage,
    public alertCtrl: AlertController,
    public toastController: ToastController
  ) {
    this.getCurrentPosition();
    this.dog = this.navParams.data.dogDetail;
    console.log('this.dog', this.dog);
    this.searchDisabled = true;
    this.saveDisabled = true;
  }

  next() {
    this.slideWithNav2.slideNext(500);
  }

  prev() {
    this.slideWithNav2.slidePrev(500);
  }

  marcarFavorito(perroid, userid) {
    this.api.traerFavoritoPerro(perroid, userid).subscribe(x => {
      console.log('marcarFavorito', x);
      if (x['data']) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
    })
  }

  controlData() {
    this.storage.get('datauser').then(val => {
      if (val) {
        console.log('dataUser', val);
        this.userid = val['usuarioid'];
        this.marcarFavorito(this.dog['perroid'], val['usuarioid']);
        if (val['usuarioid'] == this.dog['usuarioid']) {
          this.perroMio = false;
        } else {
          this.perroMio = true;
        }
      }
    })
  }

  //Ver otros perros
  goToListUser(id, name) {
    this.navCtrl.push(ListDogUserPage, { id: id, userName: name, pageId: this.pageId });
  }

  //EstadoDog
  estado(dog) {
    if (dog.estado == 2) {
      return 'Perdido';
    } else if (dog.estado == 3) {
      return 'Encontrado'
    } else if (dog.estado == 4) {
      return 'En Adopción'
    }else if (dog.estado == 5) {
      return 'Callejerito'
    } else {
      return 'En Casa';
    }
  }
  //Chat
  goToChat() {
    this.navCtrl.push(ChatPage, { origenid: this.userid, tipoorigen: 'usuario', destinoid: this.dog['usuarioid'], tipodestino: 'usuario', conversandocon: this.dog['usuarionombre'] });
  }
  //Position
  getCurrentPosition() {
    this.geo.getCurrentPosition().then((pos) => {
      this.locationUser.lat = pos.coords.latitude;
      this.locationUser.lng = pos.coords.longitude;
      console.log('position', this.locationUser);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  //FullScreen
  showImg(url) {
    this.photoViewer.show('https://ctrlztest.com.ar/lupacan/apirest/upload/10-1.jpg', 'My Dog', { share: false });
  }

  goToRefugio() {
    this.navCtrl.push(ProfileServiceUserPage, this.dataRefugio);
  }


  ionViewWillEnter() {
    this.createMap();
    this.controlData();
    console.log('vuelta', this.navParams.get('vuelta'))
    if (this.navParams.get('vuelta')) {
      console.log('hola');
      this.vuelta = false;
    } else {
      console.log('chau');
      this.vuelta = true;
    }
    this.dog = this.navParams.data.dogDetail;
    this.controlRefugio(this.dog);
    console.log('detail', this.dog);
    this.showMyControls = this.navParams.data.isMyDogs;
    this.pageId = this.navParams.data.pageId;
    if (this.pageId == 2)
      this.thisDogIsLost = true;
    if (this.pageId == 4)
      this.thisDogIsToBeAddopted = true;
  }

  controlRefugio(dog) {
    if (dog.refugioid != "0") {
      this.api.getLocalData(dog.refugioid).subscribe(x => {
        this.dataRefugio = x['data'];
          this.dataRefugio.categorias.map(cat => {
            if (cat.categoriaid == '9') {
              this.dataRefugio.refugio = true;
            } else {
              this.dataRefugio.refugio = false;
            }
          })
        console.log('reef', this.dataRefugio);
      })
    }
  }

  createMap() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.distanceService = new google.maps.DistanceMatrixService;
      if (this.dog.placeid != "") {
        this.selectPlace(this.dog['placeid']);
        this.getDistance(this.dog['perrodireccion'])
      } else {
        this.selectPlace(this.dog['estadoplaceid']);
        this.getDistance(this.dog['estadodireccion'])
      }

    });
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

  getDistance(direcc) {
    this.distanceService.getDistanceMatrix({
      origins: [this.locationUser],
      destinations: [direcc],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.Metric,
      avoidHighways: false,
      avoidTolls: false
    }, (response, status) => {
      console.log('dataaaaaa', response);
      console.log('dataaaaaaSTAUS', status);
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        console.log('data', response)
        //console.log('respuesta', response['rows'][0]['elements'][0]['distance']['text']);
        if (response['rows'][0]['elements'][0]['status'] == 'NOT_FOUND') {
          this.distanciaPerro = 'Fuera del area';
          this.distanciaAuto = 'Fuera del area';
        } else {
          console.log('distancia', this.distanciaPerro);
          this.distanciaAuto = response['rows'][0]['elements'][0]['duration']['text'];
          this.distanciaPerro = response['rows'][0]['elements'][0]['distance']['text'];
        }
      }
    });//Aca termina de resolver una distancia
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad photo-slide');
  }

  showAlert(dog) {
    this.getPlaceid(this.userid, dog['perroid'], this.locationUser.lat, this.locationUser.lng);
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
    this.getPlaceid(this.userid, dog['perroid'], this.otherLocation.lat, this.otherLocation.lng);
  }

  getPlaceid(usuarioid, perroid, latitude, longitude) {
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
          self.api.marcarDogEncontrado(usuarioid, perroid, address, placeid).subscribe(x => {
            console.log('vueltaEncontrado', x);
            let data = JSON.parse(x['_body'])['data'];
            if (data == 'updated') {
              self.foundDog();
              self.ionViewWillEnter();
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

  selectPlace(placeid) {
    console.log('place', placeid);
    //this.places = [];
    let location = {
      lat: null,
      lng: null,
      name: this.dog.perrodireccion
    };
    this.placesService.getDetails({ placeId: placeid }, (details) => {
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
        this.locationDog = location;
        console.log('location', this.locationDog);
      });
    });
  }


  iFoundThisDog(dog) {
    const alert = this.alertCtrl.create({
      title: 'Perro encontrado!',
      subTitle: 'Estas seguro que vos tenes este perro? De ser asi le enviaremos tu email al duenio para que se pongan en contacto.',
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

  goToSlider(dog) {
    this.navCtrl.push(PhotoSliderPage, dog.imageCollection)
  }

  iWannaThisDog(dog) {
    const alert = this.alertCtrl.create({
      title: 'Perro en adopcion!',
      subTitle: 'Estas seguro que desea adoptar este perro? De ser asi le enviaremos tu email al dueño para que se pongan en contacto.',
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
            this.api.quieroAdoptar(this.userid, dog.perroid).subscribe(data => {
              console.log('dataAdoptar', data);
            })
          }
        }
      ]
    });

    alert.present();
  }

  async foundDog() {
    const toast = await this.toastController.create({
      message: "Gracias por avisarnos. Nos comunicaremos con su dueño y avisaremos en la comunidad!",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Lo eliminaste de tus favoritos :(",
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
      message: "Listo!\n Se agrego a tus favoritos.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
