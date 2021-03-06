import { Geolocation } from '@ionic-native/geolocation';
import { FiltrosPage } from './../filtros/filtros';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ServiceDetailPage } from "../service-detail/service-detail";
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-service-list',
  templateUrl: 'service-list.html',
})
export class ServiceListPage {

  sinOrdenar: boolean = true;
  hayLocales: boolean = false;
  imgSrc: string;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  locationUser: any = {};
  private services: any[];
  private filteredServices: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  private categoryId: any;
  dataCategory: any;
  placesService: any;
  bounds: any;
  verFiltro: boolean;
  verfav: boolean;
  distanceService: any;
  services2: any = [];
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
    console.log('stack_Filtrado', navParams.get('stackFiltrado'));
    this.dataCategory = this.navParams.get('cat');
    this.categoryId = this.navParams.get('catId');
    this.searchDisabled = true;
    this.saveDisabled = true;
    //this.filteredServices = this.services.filter(item => item.categoryId == this.categoryId);
  }


  createMap() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.bounds = new google.maps.LatLngBounds();
      this.distanceService = new google.maps.DistanceMatrixService;
      this.selectPlace(this.services);
    });
  }

  getCurrentPosition() {
    this.storage.get('locatioUser').then(val => {
      if (val != null) {
        this.locationUser.lat = val.lat;
        this.locationUser.lng = val.lng;
        console.log('locationUser', val);
      } else {
        this.geo.getCurrentPosition().then((pos) => {
          this.locationUser.lat = pos.coords.latitude;
          this.locationUser.lng = pos.coords.longitude;
          console.log('position', this.locationUser);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      }
    })
  }

  createMarkUser() {
    this.storage.get('datauser').then(val => {
      var iconBase = "https://ctrlztest.com.ar/lupacan/apirest/";
      if (val != null) {
        if (val.imagen == "" && val.facebookid != "") {
          this.imgSrc = "https://graph.facebook.com/" + val.facebookid + "/picture?type=large";
        } else if (val.imagen != "") {
          this.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + val.imagen
        } else {
          this.imgSrc = '../../assets/imgs/1.jpg';
        }
        var icon = {
          //path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#488aff',
		      fillOpacity: 1,
          scale: 10,
          strokeWeight:3,
          strokeColor:"#fff",
        };
        this.maps.map.setCenter({ lat: this.locationUser.lat, lng: this.locationUser.lng });
        var marker = new google.maps.Marker({
          map: this.maps.map,
          //title: local.nombre,
          icon: icon,
          draggable: false,
          position: { lat: this.locationUser.lat, lng: this.locationUser.lng }
        });
      }
    })
  }

  selectPlace(locales) {
    console.log('place', locales);
    //this.places = [];
    var iconBase = "https://ctrlztest.com.ar/lupacan/apirest/";
    locales.map(local => {
      let location = {
        lat: null,
        lng: null,
        name: local.direccion
      };
      var icon = {
        url: iconBase + this.navParams.data.cat.icono,
        fillColor: 'yellow',
        fillOpacity: 0.8,
        scale: 1,
        strokeColor: 'gold',
        strokeWeight: 14,
        size: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 40)
      };
      if(local.placeid){
        this.placesService.getDetails({ placeId: local.placeid }, (details) => {
          if(details){
            console.log('details_list_serv', details)
            this.zone.run(() => {
              location.name = details.name;
              location.lat = details.geometry.location.lat();
              location.lng = details.geometry.location.lng();
              this.saveDisabled = false;
              //this.maps.map.setCenter({ lat: this.locationUser.lat, lng: this.locationUser.lng });
              var marker = new google.maps.Marker({
                map: this.maps.map,
                title: local.nombre,
                icon: icon,
                draggable: false,
                position: { lat: location.lat, lng: location.lng }
              });
              this.location = location;
              //this.bounds.extend({ lat: location.lat, lng: location.lng });
            });
          }
        });
      }
      this.createMarkUser();
      this.distanceService.getDistanceMatrix({
        origins: [this.locationUser],
        destinations: [local.direccion],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.Metric,
        avoidHighways: false,
        avoidTolls: false
      }, async (response, status) => {
        if (status !== 'OK') {
          //alert('Error was: ' + status);
          console.log('Error was: ' , status)
        } else {
          console.log('data', response)
          console.log('respuesta', response['rows'][0]['elements'][0]['distance']['text']);
          local.distanciaUser = await response['rows'][0]['elements'][0]['distance']['text'];
          local.distanciaValue = await response['rows'][0]['elements'][0]['distance']['value'];
        }
        setTimeout(() => {
          this.ordenar();
        }, 1000);
      });
      console.log('local', local);
    })
    //this.maps.map.fitBounds(this.bounds);
  }

  ordenar() {
    this.services2 = this.services.sort(function (a, b) {

      //console.log(a.nombre + " - "+ a.distance+ " - "+ b.nombre + " - "+b.distance+ "&")
      if (a.distanciaValue > b.distanciaValue) {
        return 1
      }
      if (a.distanciaValue < b.distanciaValue) {
        return -1
      }
      return 0
    });
    this.sinOrdenar = false;
    //console.log('serv2', this.services2);
  }


  ionViewWillEnter() {
    this.getStore();
  }

  getStore() {
    this.storage.get('datauser').then(val => {
      this.apiService.getStores(this.categoryId, val['usuarioid']).subscribe(x => {
        console.log('dataService', x);
        this.services = x['data'];
        if(this.services.length>0){
          this.createMap()
          this.hayLocales = false;
        }else{
          this.hayLocales = true;        
        }
        //this.selectPlace(this.services);
      })
    })
  }

  updateFilter(verFiltro) {
    this.verfav = false;
    if (verFiltro) {
      let filtrosModal = this.modalCtrl.create(FiltrosPage, { categoriaId: this.categoryId, filtrosDe: 'service', stackFilter: this.services });
      filtrosModal.present();
      filtrosModal.onDidDismiss(data => {
        this.services2 = data;
      });
    } else {
      this.services2 = this.services;
    }
  }

  updateFilterFav(verfav) {
    this.verFiltro = false;
    let originList = this.services;
    console.log(verfav);
    if (verfav) {
      this.services2 = this.services.filter(x => {
        return x.favorito == "1";
      })
    } else {
      this.services2 = this.services;
    }
  }

  ionViewDidLoad() {
    this.getCurrentPosition();
    console.log('ionViewDidLoad ServiceListPage');
  }

  goToService(service) {
    this.navCtrl.push(ServiceDetailPage, { serv: service, cat: this.dataCategory, icon: this.navParams.data.cat.icono });
  }

  goBack() {
    this.navCtrl.pop();
  }

  traerPublicidad() {
    /* this.apiService.getPublicidad("2").subscribe(x=>{
      console.log('publicidad',x);
    }) */
  }
}
