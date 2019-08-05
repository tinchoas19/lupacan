import { ServiPage } from './../servi/servi';
import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Select, ModalController } from 'ionic-angular';
import { DogPage } from "../dog/dog";
import { ApiProvider } from '../../providers/api/api';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { FiltrosPage } from '../filtros/filtros';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  bounds:any;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  @ViewChild('select1') select1: Select;
  @ViewChild('select2') select2: Select;
  public segment: string = 'dog';
  dogs: any = [];
  filteredDogs: any = [];
  public pageData: any = {};
  verFiltro: boolean;
  verMapa: boolean;
  filtrosActive: boolean;
  mostrarMapa:boolean;
  placesService: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location:any;
  selectraza:any;
  selectgenero:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public maps: GoogleMapsProvider,
    public zone: NgZone,
    public modalCtrl: ModalController, 
    private services : ApiProvider
  ) {  
    this.mostrarMapa = false;
    this.searchDisabled = true;
    this.saveDisabled = true;
  }

  goToDogDetail(dog){
    this.navCtrl.push(PhotoSliderPage,{chatid: "8",dogDetail: dog, isMyDogs: false, pageId: this.pageData.id});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage'); 
    this.createMap();
  }

  ultimosAgregados(){
    this.services.getUltimosAgregados().subscribe(x=>{
      console.log('ultimos', x);
      this.dogs = x['data'];
    })
  }

  createMap(){
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.bounds = new google.maps.LatLngBounds();
      this.selectPlace(this.filteredDogs);
    });
  }

  selectPlace(dogs) {
    console.log('place', dogs);
    //this.places = [];
    var iconBase = "http://ctrlztest.com.ar/lupacan/apirest/";
    dogs.map(dog=>{
      let location = {
        lat: null,
        lng: null,
        name: dog.perrodireccion
      };
      var icon = {
        url: iconBase+dog.fotos[0].fotourl,
        fillColor: 'yellow',
        fillOpacity: 0.8,
        scale: 1,
        strokeColor: 'gold',
        strokeWeight: 14,
        size: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 40)
      };
      this.placesService.getDetails({ placeId: dog.placeid }, (details) => {
        this.zone.run(() => {
          location.name = details.name;
          location.lat = details.geometry.location.lat();
          location.lng = details.geometry.location.lng();
          this.saveDisabled = false;
          this.maps.map.setCenter({ lat: location.lat, lng: location.lng });
          var marker = new google.maps.Marker({
            map: this.maps.map,
            title: dog.nombre,
            icon: icon,
            draggable: true,
            position: { lat: location.lat, lng: location.lng }
          });
          this.location = location;
          this.bounds.extend({ lat: location.lat, lng: location.lng });
        });
      });
    })
    this.maps.map.fitBounds(this.bounds);
  }
  
  openSelectRaza(){
    this.select1.open();
  }

  somethingRaza(e){
    console.log('e-raza',e);
  }
  somethingGenero(e){
    console.log('e-genero',e);
  }
  somethingUbicacion(e){
    console.log('e-ubicacion',e);
  }
  openSelectGenero(){
    this.select2.open();
  }

  updateCucumber(){
    console.log('Cucumbers new state:' + this.verFiltro);
    if(this.verFiltro){
      this.verMapa = false;
      this.filtrosActive = true;
      this.mostrarMapa = false;
      let filtrosModal = this.modalCtrl.create(FiltrosPage ,{categoriaId: null, filtrosDe: 'perros', stackFilter: this.filteredDogs});
      filtrosModal.present();
      filtrosModal.onDidDismiss(data => {
        this.filteredDogs = data;
      });
    }else{
      this.filtrosActive = false;
      this.filteredDogs = this.dogs;      
    }
  }

  updateVerMapa(){
    //this.verFiltro = !this.verFiltro;
    console.log('Cucumbers new state:' + this.verMapa);
    if(this.verMapa){
      this.verFiltro = false;
      this.mostrarMapa = true; 
    }else{
      this.mostrarMapa = false;
    }
  }

  ionViewWillEnter(){
    this.ultimosAgregados();
    this.services.getDogs().subscribe(data => {
      console.log(data , 'sarasaaa');
      this.dogs = (data["data"]);
    
    this.pageData = this.navParams.data;
    console.log("page: ", this.pageData.id);
    console.log(this.dogs);
    switch (this.pageData.id) {
      case 2:
        this.filteredDogs = this.dogs.filter(item => item.estaperdido == "1");
        break;
      case 3:
        this.filteredDogs = this.dogs.filter(item => item.estaencontrado == "1");
        break;
      case 4:
        this.filteredDogs = this.dogs.filter(item => item.estaenadopcion == "1");
        break;
      default:
        this.filteredDogs = this.dogs;
        break;
    }
    console.log('filtered', this.filteredDogs);
  });
  }

  goServices(){
    this.navCtrl.push(ServiPage);
  }

}
