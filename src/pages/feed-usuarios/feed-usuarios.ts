import { map } from 'rxjs/operators/map';
import { Storage } from '@ionic/storage';
import { ListDogUserPage } from './../list-dog-user/list-dog-user';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';


@Component({
  selector: 'page-feed-usuarios',
  templateUrl: 'feed-usuarios.html',
})
export class FeedUsuariosPage {
  todos: any;
  @ViewChild('slideWithNav2') slideWithNav2: Slides;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  bounds: any;
  ultimosAgregados: any = [];
  todosUsers: any = [];
  verFiltro: boolean;
  verMapa: boolean;
  verFav: boolean;
  filtrosActive: boolean;
  mostrarMapa: boolean;
  placesService: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    public maps: GoogleMapsProvider,
    public zone: NgZone,
    private storage: Storage
  ) {
    this.mostrarMapa = false;
    this.searchDisabled = true;
    this.saveDisabled = true;
  }

  next() {
    this.slideWithNav2.slideNext(500);
  }

  prev() {
    this.slideWithNav2.slidePrev(500);
  }

  ionViewWillEnter() {
    this.getAllUsers();
    this.getUltimosAgregados();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedUsuariosPage');
  }

  getUltimosAgregados() {
    this.api.getUltimosAgregadosUsuarios().subscribe(x => {
      this.ultimosAgregados = x['data'];
      //console.log('ultimos_agre',this.ultimosAgregados[3].imagen);
      this.ultimosAgregados.map(user=>{
        if (user.facebookid != '0') {
          user.imgSrc = "https://graph.facebook.com/" + user.facebookid + "/picture?type=large";
        } else if (user.imagen != "") {
          user.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + user.imagen
        } else {
          user.imgSrc = 'assets/imgs/1.jpg';
        }
      })
    })
  }

  getAllUsers() {
    this.storage.get('datauser').then(val=>{
      if(val!=null){
        this.api.getAllUsers(val['usuarioid']).subscribe(x => {
          console.log('todos', x);
          this.todosUsers = x['data'];
          this.todos = x['data'];
          this.todosUsers.map(user=>{
            if (user.facebookid != '0') {
              user.imgSrc = "https://graph.facebook.com/" + user.facebookid + "/picture?type=large";
            } else if (user.imagen != "") {
              user.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + user.imagen
            } else {
              user.imgSrc = 'assets/imgs/1.jpg';
            }
          })
        })
      }
    })
  }

  goToUserDetail(user) {
    this.navCtrl.push(ListDogUserPage, { id: user.usuarioid })
  }

  goServicios() {
    this.navCtrl.pop();
  }

  updateVerMapa() {
    this.createMap();        
    //this.verFiltro = !this.verFiltro;
    console.log('Cucumbers new state:' + this.verMapa);
    if (this.verMapa) {
      this.verFiltro = false;
      this.mostrarMapa = true;
    } else {
      this.mostrarMapa = false;
    }
  }

  createMap() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.bounds = new google.maps.LatLngBounds();
      this.getPlaceid(this.todosUsers);
    });
  }

  getPlaceid(users) {
    var geocoder = new google.maps.Geocoder();
    let placeid: any;
    let address: any;
    var self = this;
    var iconBase = "https://ctrlztest.com.ar/lupacan/apirest/";

    users.map(user => {
      if (user.direccion != "") {
        if (user.imagen != "") {
          var icon = {
            url: iconBase + user.imagen,
            fillColor: 'yellow',
            fillOpacity: 0.8,
            scale: 1,
            strokeColor: 'gold',
            strokeWeight: 14,
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 40)
          };
        }else{
          var icon = {
            url: '../../assets/imgs/dog.jpg',
            fillColor: 'yellow',
            fillOpacity: 0.8,
            scale: 1,
            strokeColor: 'gold',
            strokeWeight: 14,
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 40)
          };
        }
        geocoder.geocode({ 'address': user.direccion }, function (results, status) {
          self.zone.run(() => {
            console.log('relslsl', results);
            if (status === google.maps.GeocoderStatus.OK) {
              var marker = new google.maps.Marker({
                map: self.maps.map,
                title: user.nombre,
                icon: icon,
                draggable: false,
                position: results[0].geometry.location
              })
            }
          });
        });

      } else {
        console.log('usuario ' + user.usuarioid + ' sin direccion');
      }

    })
    
  }

  filtrarFavoritos(){
    if(this.verFav){
      this.todosUsers = this.todosUsers.filter(dog=>{
        return dog.favorito == '1';
      })
    }else{
      this.todosUsers = this.todos;
    }
  }

}
