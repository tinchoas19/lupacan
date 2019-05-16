import { Storage } from '@ionic/storage';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PhotoSliderPage } from '../photo-slider/photo-slider';
import { PhotoViewer } from '@ionic-native/photo-viewer';

declare var google : any;

@IonicPage()
@Component({
  selector: 'page-dog',
  templateUrl: 'dog.html',
})
export class DogPage {
  @ViewChild('map') mapRef: ElementRef;
  map: any;
  private dog: any=[];
  public checkAsLost: boolean;
  public thisDogIsLost: boolean = false;
  public thisDogIsToBeAddopted: boolean = false;
  perdido_fecha: String = new Date().toISOString();
  perdido_en: String = 'Av. Los Incas 5150';
  private pageId: number;
  public showMyControls: boolean;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private photoViewer: PhotoViewer, 
    public alertCtrl: AlertController,
    private storage: Storage
  ) { 
  }

  //Fullscreeen
  showImg(url){
    console.log(url);
    this.photoViewer.show('http://ctrlztest.com.ar/lupacan/apirest/upload/10-1.jpg', 'My Dog', {share: false}); 
  }

  ionViewWillEnter(){
    //this.fechaHoy();
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
    setTimeout(()=>{
      this.loadMap();
    },1000)
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Ya se publico como perdido. Junto a la comunidad lo vamos a encontrar.',
      buttons: ['OK']
    });
      alert.present();
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
    }
    //create map
    this.map = new google.maps.Map(mapEle, options)
    
    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow();

    this.geocodeAddress(geocoder, this.map, infowindow);
  }

  async geocodeAddress(geocoder, resultMap, infowindow){
    console.log('adress', this.dog['direccion']);
    var address = this.dog['direccion']

    await geocoder.geocode({'address': address}, (results,status)=>{
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

}
