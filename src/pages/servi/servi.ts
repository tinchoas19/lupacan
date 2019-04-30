import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceListPage } from "../service-list/service-list";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-servi',
  templateUrl: 'servi.html',
})
export class ServiPage {

@ViewChild('map') mapElement: ElementRef;
servicios: string = "mapa";
currentPos : Geoposition;
map: any;
dogwalkMarker : any;
info : any;
infoWindows: any =[];
private categories: any[];
private services: any[];
private filteredServices: any[];
private showCategories: boolean = true;
public inputText: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private geolocation: Geolocation
  ) {
    this.services = [
      {
        "serviceId": 1,
        "serviceName": "Vererinaria Patito",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 2,
        "serviceName": "Vererinaria Patito2",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 3,
        "serviceName": "Vererinaria Patito3",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 4,
        "serviceName": "Vererinaria Patito4",
        "categoryId": 2,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 5,
        "serviceName": "Vererinaria Patito5",
        "categoryId": 2,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 6,
        "serviceName": "Vererinaria Patito6",
        "categoryId": 3,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 7,
        "serviceName": "Vererinaria Patito7",
        "categoryId": 4,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 8,
        "serviceName": "Vererinaria Patito 8",
        "categoryId": 4,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      }


    ];
    this.categories = [
      {
        "categoryId": 1,
        "categoryName": "Adiestramiento",
        "categoryImg": "cat-adiestramiento.png",
      },
      {
        "categoryId": 2,
        "categoryName": "Alimentos",
        "categoryImg": "cat-alimentos.png",
      },
      {
        "categoryId": 3,
        "categoryName": "Atencion Medica",
        "categoryImg": "cat-atencion.png",
      },
      {
        "categoryId": 4,
        "categoryName": "Guarderias",
        "categoryImg": "cat-guarderia.png",
      },
      {
        "categoryId": 5,
        "categoryName": "Paseadores",
        "categoryImg": "cat-paseadores.png",
      },
      {
        "categoryId": 6,
        "categoryName": "Peluqueria",
        "categoryImg": "cat-peluqueria.png",
      },
      {
        "categoryId": 7,
        "categoryName": "Pet Friendly",
        "categoryImg": "cat-friendly.png",
      },
      {
        "categoryId": 8,
        "categoryName": "Productos",
        "categoryImg": "cat-productos.png",
      },
      {
        "categoryId": 9,
        "categoryName": "Refugios",
        "categoryImg": "cat-refugios.png",
      }
     
    ];
  }

  ionViewWillEnter(){
    this.getUserPosition();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiPage');
    //this.getUserPosition();
  }

  getUserPosition(){
    this.geolocation.getCurrentPosition().then((pos : Geoposition) => {    
      this.currentPos = pos;  
      console.log(this.currentPos);
      this.addMap(pos.coords.latitude,pos.coords.longitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    });
  }

  addMap(lat,long){
    let latLng = new google.maps.LatLng(lat, long);

    let mapOptions = {
    center: latLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
    this.setLocation();
  }

  addMarker(){

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });

    let content = "<p>Estas aqui!</p>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

  }

  setLocation(){
    var geocoder = new google.maps.Geocoder();
    this.services.map(x=>{
      var address = x.serviceAddress;
      geocoder.geocode({'address': address}, (results, status)=>{
        console.log('results', results);
        console.log('status', status);
        if(status === 'OK'){
          //this.map.setCenter(results[0].geometry.location);
          console.log('results',results);
          /* x.location['lat'] = results[0].geometry.location.lat();
          x.location['lng'] = results[0].geometry.location.lng(); */
          this.dogwalkMarker = new google.maps.Marker({
            draggable: false,
            animation: google.maps.Animation.DROP,
            position : results[0].geometry.location,
            icon: {
              //url: this.url+x.foto,
              origin: new google.maps.Point(0, 0),
              size: new google.maps.Size(50, 50),
              scaledSize: new google.maps.Size(40, 40)
            },
            title: x.serviceName,
            info: x,
            //index: this.num,
          });
          //this.num++;
        this.dogwalkMarker.setMap(this.map);
        this.addInfoWindowToMarker(this.dogwalkMarker);
      }else {
        alert('Geocode was not successful for the following reason: ' + status);
      };
    })
    })
  }

  //infoWindowMarkers
  addInfoWindowToMarker(marker){
    let infoMarker = marker['info'];    
    console.log('mark', marker);
    let infoWindowContent =
    "<div id=container style='color:#000;background-color:#fff;padding:5px;width:150px;'>"+
      "<h4 style='margin:0px'>"+infoMarker.serviceName+"</h4>"+
      "<hr />"+
        "<div id=imageInfo>"+
          /* "<img src="+marker.icon.url+">"+ */
        "</div>"+
      "<hr />"+
      "<button id=goToLocal>Detalle Local</button>"+
    "</div>";

    let infoWindow = new google.maps.InfoWindow({
      content : infoWindowContent,
      info: marker
    });

    google.maps.event.addListenerOnce(infoWindow,'domready', ()=>{
      //console.log('esteEs', infoWindow.info);
      this.info = infoWindow.info;

      document.getElementById('goToLocal').addEventListener('click', ()=>{
        const animationOptions = {
          animation : 'md-transition',
          duration: 1000,
        }
          //console.log('aqui',this.info);
          //this.navCtrl.push(InfoLocalPage, {info:this.info}, animationOptions);
      })
    })

    marker.addListener('click', ()=>{
      //console.log('nameBOL', nombreBol);
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker)
    })
    this.infoWindows.push(infoWindow);
  }

  //cerrar infoWindow
  closeAllInfoWindows(){
    for(let window of this.infoWindows){
      window.close();
    }
  }
  
  goToCategory(category){
    this.navCtrl.push(ServiceListPage, category);
  }
  
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;
    this.inputText = val;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.showCategories = false; 
      this.filteredServices = this.services.filter((item) => {
        return (item.serviceName.toLowerCase().indexOf(val.toLowerCase()) > -1 );
      });
    }
    else{
      this.showCategories = true; 
    }
  }
}
