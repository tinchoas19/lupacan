import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { PhotoSliderPage } from '../photo-slider/photo-slider';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

declare var google : any;

@IonicPage()
@Component({
  selector: 'page-dog',
  templateUrl: 'dog.html',
})
export class DogPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  private dog: any=[];
  public checkAsLost: boolean;
  public thisDogIsLost: boolean = false;
  public thisDogIsToBeAddopted: boolean = false;
  perdido_fecha: String = new Date().toISOString();
  perdido_en: String = 'Av. Los Incas 5150';
  private pageId: number;
  public showMyControls: boolean;
  placesService: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  dogId:any;
  query: string = '';
  places: any = [];
  autocompleteService: any;
  otherLocation = {
    lat: null,
    lng: null
  }
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private photoViewer: PhotoViewer, 
    public alertCtrl: AlertController,
    public maps: GoogleMapsProvider,
    public zone: NgZone,
    private storage: Storage,
    private api: ApiProvider,
    public toastController: ToastController
  ) {   
    this.searchDisabled = true;
    this.saveDisabled = true; 
  }

  //Fullscreeen
  showImg(url){
    console.log(url);
    this.photoViewer.show('http://ctrlztest.com.ar/lupacan/apirest/upload/10-1.jpg', 'My Dog', {share: false}); 
  }

  ionViewWillEnter(){
    if(this.navParams.data.dogDetail){
      this.dog = this.navParams.data.dogDetail;    
    }else{
      this.dogId = this.navParams.data.perroid;
      this.api.getDogData(this.dogId).subscribe(x=>{
        console.log('perroid',x);
        this.dog = x['data'];
      })
    }    
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
      this.selectPlace(this.dog['placeid']);
    });
    console.log('detail', this.dog);
    this.showMyControls = this.navParams.data.isMyDogs;
    this.pageId = this.navParams.data.pageId;
    if (this.pageId == 2)
      this.thisDogIsLost = true;
    if (this.pageId == 4)
      this.thisDogIsToBeAddopted = true;
  }

  ionViewDidLoad() {
    //console.log('detail', this.dog);
    console.log('ionViewDidLoad DogPage');
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

  getPlace(place){
    this.query = place.description;
    this.places = [];
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      this.zone.run(() => {
        this.otherLocation.lat = details.geometry.location.lat();
        this.otherLocation.lng = details.geometry.location.lng();
      })
    })
    console.log('placeSlected', place);  
  }

  newDogLocation(){
    this.api.marcarDogPerdido(this.dog['usuarioid'], this.dog['perroid'], this.otherLocation.lat, this.otherLocation.lng).subscribe(x=>{
      console.log('vueltaPerdido',x);
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

  showAlert() {
    this.storage.get('locatioUser').then(location=>{
      this.api.marcarDogPerdido(this.dog['usuarioid'], this.dog['perroid'], location['lat'], location['lng']).subscribe(x=>{
        console.log('vueltaPerdido',x);
        let data = JSON.parse(x['_body'])['data'];
        if(data == 'update'){
          this.presentToasteEx();
        }
      })
    })
    /* const alert = this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Ya se publico como perdido. Junto a la comunidad lo vamos a encontrar.',
      buttons: ['OK']
    });
      alert.present(); */
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

  goToSlider(dog){
    this.navCtrl.push(PhotoSliderPage, dog.imageCollection)
  }

  iWannaThisDog(dog){
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

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n No te preocupes ya avisamos a los usuarios de LupaCan cercanos a ti.",
      duration:3000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }
}
