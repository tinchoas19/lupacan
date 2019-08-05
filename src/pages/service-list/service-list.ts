import { Geolocation } from '@ionic-native/geolocation';
import { FiltrosPage } from './../filtros/filtros';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ServiceDetailPage } from "../service-detail/service-detail";
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

declare var google : any;

@IonicPage()
@Component({
  selector: 'page-service-list',
  templateUrl: 'service-list.html',
})
export class ServiceListPage {
  
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  locationUser:any={};
  private services: any[];
  private filteredServices: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  private categoryId: any;
  dataCategory:any;
  placesService: any;
  bounds:any;
  verFiltro:boolean;
  verfav:boolean;
  distanceService:any;
  services2:any=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiService: ApiProvider, 
    public modalCtrl: ModalController,
    public maps: GoogleMapsProvider,
    private geo: Geolocation,
    public zone: NgZone,
    private storage: Storage,
  ) {
    console.log('stack_Filtrado',navParams.get('stackFiltrado'));
    this.getCurrentPosition();
    this.dataCategory = this.navParams.get('cat');
    this.categoryId = this.navParams.get('catId');
    this.getStore();    
    this.searchDisabled = true;
    this.saveDisabled = true;
    //this.filteredServices = this.services.filter(item => item.categoryId == this.categoryId);
  }


  createMap(){
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.bounds = new google.maps.LatLngBounds();
      this.distanceService = new google.maps.DistanceMatrixService;
      this.selectPlace(this.services);
    });
  }

  getCurrentPosition(){
    this.geo.getCurrentPosition().then((pos)=>{
      this.locationUser.lat = pos.coords.latitude;
      this.locationUser.lng = pos.coords.longitude;
      console.log('position', this.locationUser);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  selectPlace(locales) {
    console.log('place', locales);
    //this.places = [];
    var iconBase = "http://ctrlztest.com.ar/lupacan/apirest/";
    locales.map(local=>{
      let location = {
        lat: null,
        lng: null,
        name: local.direccion
      };
      var icon = {
        url: iconBase+local.icono,
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
          this.bounds.extend({ lat: location.lat, lng: location.lng });
        });
      });
      this.distanceService.getDistanceMatrix({
        origins: [this.locationUser],
        destinations: [local.direccion],
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
          local.distanciaUser = await response['rows'][0]['elements'][0]['distance']['text'];
          local.distanciaValue = await response['rows'][0]['elements'][0]['distance']['value'];
        }
        setTimeout(()=>{
          this.ordenar();  
        },300);
      });
      console.log('local',local);
    })
    this.maps.map.fitBounds(this.bounds);
  }

  ordenar(){
    this.services2 = this.services.sort(function(a, b) {
      
      //console.log(a.nombre + " - "+ a.distance+ " - "+ b.nombre + " - "+b.distance+ "&")
      if(a.distanciaValue > b.distanciaValue){
        return 1
      }
      if(a.distanciaValue < b.distanciaValue){
        return -1
      }
      return 0
    });
    //console.log('serv2', this.services2);
  }


  ionViewWillEnter(){
    this.createMap();
  }

  getStore(){
    this.storage.get('datauser').then(val=>{
      this.apiService.getStores(this.categoryId, val['usuarioid']).subscribe(x=>{
        console.log('dataService', x);
        this.services = x['data'];
      }) 
    })
  }

  updateFilter(verFiltro){
    this.verfav = false;
    if(verFiltro){
      let filtrosModal = this.modalCtrl.create(FiltrosPage ,{categoriaId: this.categoryId, filtrosDe: 'service', stackFilter: this.services});
      filtrosModal.present();
      filtrosModal.onDidDismiss(data => {
        this.services2 = data;
     });
    }else{
      this.services2 = this.services;
    }
  }

  updateFilterFav(verfav){
    this.verFiltro = false;
    let originList = this.services;
    console.log(verfav);
    if(verfav){
      this.services2 = this.services.filter(x=>{
        return x.favorito == "1";
      })
    }else{
      this.services2 = this.services;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceListPage');
  }

  goToService(service) {
    this.navCtrl.push(ServiceDetailPage, service);
  }

  goBack(){
    this.navCtrl.pop();
  }
}
