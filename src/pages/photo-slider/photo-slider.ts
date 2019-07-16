import { ListDogUserPage } from './../list-dog-user/list-dog-user';
import { ChatPage } from './../chat/chat';
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
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
  vuelta:boolean = true;
  isChecked :boolean;
  placesService: any;
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private photoViewer: PhotoViewer,
    public modalCtrl: ModalController,
    public maps: GoogleMapsProvider,
    public zone: NgZone, 
    public alertCtrl: AlertController
  ) {
    this.dog = this.navParams.data.dogDetail;     
    this.searchDisabled = true;
    this.saveDisabled = true; 
  }

  //add Favorites
  addToFavorites(){
    console.log('add_Fav => (userid, dogid)');
    if(this.isChecked){
      //this.favorite.deleteToFavorite(userid, productid);
      this.isChecked = false;
    }else{
    console.log('remove_Fav => (userid, dogid)');      
      //this.favorite.addToFavorite(userid, productid);
      this.isChecked = true;
    }
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
    this.navCtrl.push(ChatPage,{dog:this.dog});
  }
  
  //FullScreen
  showImg(url){
    this.photoViewer.show('http://ctrlztest.com.ar/lupacan/apirest/upload/10-1.jpg', 'My Dog', {share: false}); 
  }

  ionViewWillEnter(){
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
    console.log('ionViewDidLoad photo-slide');
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.selectPlace(this.dog['placeid']);
    });    
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
