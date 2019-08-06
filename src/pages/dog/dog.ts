import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private photoViewer: PhotoViewer, 
    public alertCtrl: AlertController,
    public maps: GoogleMapsProvider,
    public zone: NgZone,
    private storage: Storage,
    private api: ApiProvider,
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
    if(this.navParams.data.dogDetail != null){
      this.dog = this.navParams.data.dogDetail;    
    }else{
      this.dogId = this.navParams.data.perroid;
      this.api.getDogData(this.dogId).subscribe(x=>{
        console.log('perroid',x);
        this.dog = x['data'];
      })
    }    
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
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

  showAlert() {
    this.storage.get('firebaseUserId').then(val=>{
      console.log('val', val);
      /* this.api.probarPush(val).subscribe(x=>{
        console.log('prueba push',x);
      }) */
    })
    /* this.api.marcarDogPerdido(this.dog['usuarioid'], this.dog['perroid'], this.location['lat'], this.location['lng']).subscribe(x=>{
      console.log('vueltaPerdido',x);
    }) */
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
}
