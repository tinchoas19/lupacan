import { Storage } from '@ionic/storage';
import { ListCommentLocalPage } from './../list-comment-local/list-comment-local';
import { ApiProvider } from './../../providers/api/api';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { PhotoSliderPage } from '../photo-slider/photo-slider';



@IonicPage()
@Component({
  selector: 'page-service-detail',
  templateUrl: 'service-detail.html',
})
export class ServiceDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  dataCategory: any;
  private service: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  placesService: any;
  comentarios:any;
  dejarcomment:boolean;
  seguidores:any;
  isChecked :boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public maps: GoogleMapsProvider,
    public zone: NgZone,
    private api: ApiProvider,
    public toastController: ToastController,
    private storage: Storage
  ) {
    this.service = this.navParams.get('serv');
    this.dataCategory = this.navParams.get('cat');
    this.searchDisabled = true;
    this.saveDisabled = true;
    console.log("mi servicio: ", this.service.perros);
    this.dejarcomment = false;
  }

  ionViewWillEnter(){
    this.getComments();
  }

  ionViewDidLoad() {
    this.createMap();
    console.log('ionViewDidLoad ServiceDetailPage');
  }

  dejarComment(){
    this.dejarcomment = !this.dejarcomment;
  }

  sendComment(comment){
    this.storage.get('datauser').then(val=>{
      if(val != null){
        this.api.postComment(this.service['localid'], val['usuarioid'], comment).subscribe(x=>{
          console.log('dataComment',x);
          let result = JSON.parse(x['_body'])['data']
          if(result == 'sent'){
            this.presentToasteEx();
            this.dejarcomment = false;
          }else{
            this.presentToasteError();
          }
        })
      }else{
        this.presentToasteError();
      }
    })
  }

  createMap() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.selectPlace(this.service);
    });
  }

  getComments(){
    this.api.getComments(this.service['localid']).subscribe(x=>{
      this.comentarios = x['data'];
    })
  }

  goToDogDetail(dog){
    this.navCtrl.push(PhotoSliderPage,{chatid: "8",dogDetail: dog, isMyDogs: false});
  }
  
  addToFavorites(){
     this.storage.get('datauser').then(val=>{
      if(val != null){
        if(this.isChecked){
          this.api.addFavoriteLocal(val.usuarioid, this.service.localid, 0).subscribe(x=>{
            console.log('fav',x);
            let data = JSON.parse(x['_body'])['data'];
            if(data){
              this.errorToast();
            }
          });
          this.isChecked = false;
        }else{
        console.log('remove_Fav => (userid, dogid)');      
        this.api.addFavoriteLocal(val.usuarioid, this.service.localid, 1).subscribe(x=>{
          console.log('fav',x);
          let data = JSON.parse(x['_body'])['data'];
          if(data){
            this.exitoToast();
          }
        });
          this.isChecked = true;
        }
      }
    })
  }

  getSeguidores(){
    this.api.getSeguidores(this.service['localid']).subscribe(x=>{
      this.seguidores = x['data'];
      let verseguidores = this.modalCtrl.create(ListCommentLocalPage, { seguidores: this.seguidores });
      verseguidores.present();
    })
  }

  verComments(){
    let vercomments = this.modalCtrl.create(ListCommentLocalPage, { comments: this.comentarios });
    vercomments.present();
  }
  
  selectPlace(local) {
    console.log('place', local);
    //this.places = [];
    var iconBase = "http://ctrlztest.com.ar/lupacan/apirest/";
    let location = {
      lat: null,
      lng: null,
      name: local.direccion
    };
    var icon = {
      url: iconBase + local.icono,
      fillColor: 'yellow',
      fillOpacity: 0.8,
      scale: 1,
      strokeColor: 'gold',
      strokeWeight: 14,
      size: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 40)
    };
    this.placesService.getDetails({ placeId: local.placeid }, (details) => {
      this.zone.run(() => {
        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        this.saveDisabled = false;
        this.maps.map.setCenter({ lat: location.lat, lng: location.lng });
        var marker = new google.maps.Marker({
          map: this.maps.map,
          title: local.nombre,
          icon: icon,
          draggable: true,
          position: { lat: location.lat, lng: location.lng }
        });
        this.location = location;
      });
    });
  }

  closeModal() {
    this.navCtrl.pop();
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
      message: "Listo!\n Se registro tu comentario.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: "Dejaste de seguir a este Comercio!",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async exitoToast() {
    const toast = await this.toastController.create({
      message: "Listo!\n Comenzaste a seguir a este comercio.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
