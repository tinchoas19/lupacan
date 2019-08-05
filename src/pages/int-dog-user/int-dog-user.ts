import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ListDogUserPage } from '../list-dog-user/list-dog-user';
import { ChatPage } from '../chat/chat';

declare var google : any;

@Component({
  selector: 'page-int-dog-user',
  templateUrl: 'int-dog-user.html',
})
export class IntDogUserPage {

  @ViewChild('map') mapRef: ElementRef;

  private dog: any=[];
  public checkAsLost: boolean;
  public thisDogIsLost: boolean = false;
  public thisDogIsToBeAddopted: boolean = false;
  map: any;
  private pageId: number;
  public showMyControls: boolean;
  vuelta:boolean = true;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private photoViewer: PhotoViewer,
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController,
    private api: ApiProvider
  ) { 
  }
  //Ver otros perros
  goToListUser(id, name){
    this.navCtrl.push(ListDogUserPage, {id: id, userName:name, pageId: this.pageId});
  }
  //EstadoDog
  estado(dog){
    if(dog.estaperdido != 0){
      return 'Perdido';
    }else if(dog.estaenadopcion != 0){
      return 'En Adopción'
    }else if(dog.estaencontrado != 0){
      return 'Encontrado'
    }else{
      return 'En Casa';
    }
  }
  //Chat
  goToChat(){
    this.navCtrl.push(ChatPage,{dog:this.dog});
  }
  
  //FullScreen
  showImg(url){
    this.photoViewer.show('http://ctrlztest.com.ar/lupacan/apirest/'+url, 'My Dog', {share: false}); 
  }

  //Mapa
  loadMap(){

    //create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
    //Map options
    const options = {
      center: {lat: -34.397, lng: 150.644},
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      streetViewControl: true,
      disableDefaultUI: true,
      styles: [
        {
          "featureType": "poi.business",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.sports_complex",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]     
    }
    //create map
    this.map = new google.maps.Map(mapEle, options);
    google.maps.event.trigger(this.map, 'resize');
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow();

    this.geocodeAddress(geocoder, this.map, infowindow);
  }

  geocodeAddress(geocoder, resultMap, infowindow){
    var address = "Av. Los Incas 5150";

    geocoder.geocode({'address': address}, (results,status)=>{
      if(status === 'OK'){
        resultMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultMap,
          position: results[0].geometry.location
        });
        infowindow.setContent(address);
        infowindow.open(resultMap, marker);
      }else{
        alert('Geocode was not successful for the following reason: ' + status);      
      }
    });
  }

  ionViewWillEnter(){
    if(this.navParams.data.dog){
      this.api.getDogData(this.navParams.data.dog['perroid']).subscribe(x=>{
        this.dog = x['data'];
      })
    }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad DogPage');
    this.loadMap();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Le estaremos informando a su dueño!',
      buttons: ['OK']
    });
    if (this.checkAsLost) {
      alert.present();
    }
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
