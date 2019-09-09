import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Geolocation } from '@ionic-native/geolocation';
import { ListDogUserPage } from './../list-dog-user/list-dog-user';
import { ChatPage } from './../chat/chat';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

declare var google : any;

@IonicPage()
@Component({
  selector: 'page-photo-slider',
  templateUrl: 'photo-slider.html',
})
export class PhotoSliderPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  private dog: any=[];
  public checkAsLost: boolean;
  public thisDogIsLost: boolean = false;
  public thisDogIsToBeAddopted: boolean = false;
  map: any;
  private pageId: number;
  public showMyControls: boolean;
  userid:any;
  vuelta:boolean = true;
  isChecked :boolean;
  placesService: any;
  distanceService:any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  locationUser: any={lat:'',lng:''};
  locationDog: any;
  perroMio:boolean=false;
  distanciaPerro:any="Calculando...";
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
    console.log('this.dog',this.dog);
    this.searchDisabled = true;
    this.saveDisabled = true; 
  }

  marcarFavorito(perroid,userid){
    this.api.traerFavoritoPerro(perroid,userid).subscribe(x=>{
      console.log('marcarFavorito',x);
      if(x['data']){
        this.isChecked = true;
      }else{
        this.isChecked = false;
      }
    })
  }

  controlData(){
    this.storage.get('datauser').then(val=>{
      if(val){
        console.log('dataUser', val);
        this.userid=val['usuarioid'];
        this.marcarFavorito(this.dog['perroid'], val['usuarioid']);
        if(val['usuarioid'] == this.dog['usuarioid']){
          this.perroMio = false;
        }else{
          this.perroMio = true;
        }
      }
    })
  }

  //Ver otros perros
  goToListUser(id, name){
    this.navCtrl.push(ListDogUserPage, {id: id, userName:name, pageId: this.pageId});
  }

  //EstadoDog
  estado(dog){
    if(dog.estaperdido != 0){
      return 'Perdido';
    }else if(dog.estaencontrado != 0){
      return 'Encontrado'
    }else{
      return 'En Casa';
    }
  }
  //Chat
  goToChat(){
    this.navCtrl.push(ChatPage,{origenid:this.userid, tipoorigen: 'usuario', destinoid: this.dog['usuarioid'], tipodestino: 'usuario', conversandocon: this.dog['usuarionombre']});
  }
  //Position
  getCurrentPosition(){
    this.geo.getCurrentPosition().then((pos)=>{
      this.locationUser.lat = pos.coords.latitude;
      this.locationUser.lng = pos.coords.longitude;
      console.log('position', this.locationUser);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  
  //FullScreen
  showImg(url){
    this.photoViewer.show('http://ctrlztest.com.ar/lupacan/apirest/upload/10-1.jpg', 'My Dog', {share: false}); 
  }


  ionViewWillEnter(){
    this.createMap();
    this.controlData();
    console.log('vuelta',this.navParams.get('vuelta'))
    if(this.navParams.get('vuelta')){
      console.log('hola');
      this.vuelta = false;   
    }else{
      console.log('chau');
      this.vuelta = true;
    }
    this.dog = this.navParams.data.dogDetail;
    console.log('detail', this.dog);
    this.showMyControls = this.navParams.data.isMyDogs;
    this.pageId = this.navParams.data.pageId;
    if (this.pageId == 2)
      this.thisDogIsLost = true;
    if (this.pageId == 4)
      this.thisDogIsToBeAddopted = true;
  }

  createMap(){
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.distanceService = new google.maps.DistanceMatrixService;
      if(this.dog['estaperdido'] != 0){
        this.selectPlace(this.dog['perdidoplaceid']);
      }else{
        this.selectPlace(this.dog['placeid']);        
      }
      this.getDistance(this.dog['direccion'])
    }); 
  }

  getDistance(direcc){
    this.distanceService.getDistanceMatrix({
      origins: [this.locationUser],
      destinations: [direcc],
      travelMode: 'DRIVING',
      unitSystem : google.maps.UnitSystem.Metric,
      avoidHighways: false,
      avoidTolls: false
    }, async(response, status)=>{
      if (status !== 'OK'){
        alert('Error was: ' + status);
      }else{
        console.log('data',response)
        console.log('respuesta', response['rows'][0]['elements'][0]['distance']['text']);
        if(response['rows'][0]['elements'][0]['status'] == 'NOT_FOUND'){
          this.distanciaPerro = 'Fuera del area';          
        }else this.distanciaPerro = await response['rows'][0]['elements'][0]['distance']['text'];
        /*x.duration = await response['rows'][0]['elements'][0]['duration']['text'];
        x.distanceVal = await response['rows'][0]['elements'][0]['duration']['value']; */
        //console.log('duration', x.duration);
      }
    });//Aca termina de resolver una distancia
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad photo-slide');   
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Perro encontrado!',
      subTitle: 'Estas seguro/a de haber encontrado a '+this.dog.nombre+ '?',
      buttons: [
        {
          text: 'Si',
          handler: data => {
            this.storage.get('datauser').then(user=>{
              this.api.marcarDogEncontrado(user['usuarioid'], this.dog['perroid']).subscribe(x=>{
                console.log('veultaEncontrado',x);
                this.api.getUser(this.dog['usuarioid']).subscribe(user=>{
                  this.navCtrl.push(ChatPage,{user:user['data']})
                })
              })
            })
          }
        },
        {
          text: 'No',
          role: 'cancel',
        }
      ]
    });
    if (this.checkAsLost) {
      alert.present();
    }
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

  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Lo eliminaste de tus favoritos :(",
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
      message: "Listo!\n Se agrego a tus favoritos.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
