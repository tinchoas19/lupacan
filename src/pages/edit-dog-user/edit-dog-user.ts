import { MenuPage } from './../menu/menu';
import { Storage } from '@ionic/storage';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Platform, ViewController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { ApiProvider } from '../../providers/api/api';


@Component({
  selector: 'page-edit-dog-user',
  templateUrl: 'edit-dog-user.html',
})
export class EditDogUserPage {
  dataCreate: any;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  msgError: any;
  selected_raza:any;
  selected_color:any;
  selected_estado:any;
  selected_genero:any;
  selected_esterilizado:any;
  dog: any = {
    perroid: this.navParams.data.dataDog.perroid,
    usuarioid: '',
    nombre: '',
    nacimiento: '' || this.navParams.data.dataDog.fechanacimiento,
    gender: '' ,
    raza: '' ,
    esterilizado:'' || this.navParams.data.dataDog.esterilizado,
    color: '',
    descripcion: '',
    direccion:'' ,
    placeid:'' || this.navParams.data.dataDog.placeid
  };
  razas: any = [];
  colores: any = [];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public zone: NgZone,
    private storage: Storage,
    public maps: GoogleMapsProvider, public platform: Platform, public viewCtrl: ViewController,
    private services: ApiProvider,
  ) {
    this.initializeItems(this.navParams.data.dataDog);
    this.searchDisabled = true;
    this.saveDisabled = true;
    //this.navParams.data.dataDog=this.dog;
    console.log('dog_edit',this.navParams.data.dataDog);
    this.editarImagenes(this.navParams.data.dataDog.fotos);
  }

  initializeItems(params) {
    this.storage.get('datauser').then(x => {
      if (x) this.dog['usuarioid'] = x['usuarioid'];
      console.log('ja', this.dog.usuarioid)
    })
    this.services.getBreed().subscribe(data => {
      console.log('raza', data);
      this.razas = data['data']['colores'];
      this.colores = data['data']['razas'];
      this.razas.map(raza=>{                   
        if(params.raza == raza.nombre){
          this.dog.raza = raza.razaid
        }
      })
      this.colores.map(color=>{
        if(params.color == color.nombre){
          this.dog.color = color.colorid
        }
      })
      this.select(this.razas,this.colores);
    })
  }

  select(razas,colores){
    razas.map(raza=>{
      if(raza.nombre == this.navParams.data.dataDog.raza){
        this.selected_raza = raza.razaid;
      }
    })
    colores.map(color=>{
      if(color.nombre == this.navParams.data.dataDog.color){
        this.selected_color = color.colorid;
      }
    })
    this.controlParams(this.navParams.data.dataDog);
  }

  controlParams(params){
    if(params.generoid == '0'){
      this.dog.gender = params.generoid;
      this.selected_genero = false;
    }else{
      this.dog.gender = params.generoid;      
      this.selected_genero = true;
    }
    if(params.estado == '1'){
      this.selected_estado = 'comunidad';
    }
    if(params.estado == '2'){
      this.selected_estado = 'perdidos';
    }
    if(params.estado == '3'){
      this.selected_estado = 'encontrado';
    }
    if(params.estado == '4'){
      this.selected_estado = 'adopcion';
    }
    this.controlEsterilizado(params)
    this.dog.direccion = this.query = params.perrodireccion;
    this.dog.nacimiento = params.fechanacimiento;
    this.dog.nombre = params.nombre;
    //this.dog.nacimiento = params.fechanacimiento;
    this.selected_raza = params.raza;
    this.dog.color = this.selected_color;
    this.dog.descripcion = params.descripcion;
  }

  controlEsterilizado(param){
    if(param.esterilizado == "1"){
      this.dog.esterilizado = param.esterilizado;
      this.selected_esterilizado = true;
    }else{
      this.dog.esterilizado = param.esterilizado;
      this.selected_esterilizado = false;
    }
  }

  selectPlace(place) {
    console.log('place', place);
    this.query = place.description;
    this.dog.direccion = place.description;
    this.dog.placeid = place.place_id
    this.places = [];
    let location = {
      lat: null,
      lng: null,
      name: place.description
    };
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      this.zone.run(() => {
        var icon = {
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        this.saveDisabled = false;
        this.maps.map.setCenter({ lat: location.lat, lng: location.lng });
        /* var marker = new google.maps.Marker({
          map: this.maps.map,
          icon: icon,
          title: place.description,
          position: { lat: location.lat, lng: location.lng }
        }); */
        this.location = location;
      });
    });
  }

  
  searchPlace(){
    this.saveDisabled = true;
    if(this.query.length > 0 && !this.searchDisabled) {
        let config = {
            types: ['geocode'],
            input: this.query
        }
        console.log('query', this,this.query);
        this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
            if(status == google.maps.places.PlacesServiceStatus.OK && predictions){
                this.places = [];
                predictions.forEach((prediction) => {
                    this.places.push(prediction);
                });
                console.log('places', this.places);
            }
        });
    } else {
        this.places = [];
    }
  }

  validacion() {
    let ret = true;
    let msg = "";

    if (this.dog.nombre == "") {
      ret = false;
      msg += "Debe completar el nombre \n";
    }
    if (this.dog.nacimiento == "") {
      ret = false;
      msg += "Debe completar la fecha de nacimiento \n";
    }
    if (this.dog.gender == "") {
      ret = false;
      msg += "Debe escoger un genero \n";
    }
    if (this.dog.raza == "") {
      ret = false;
      msg += "Debe escoger una raza \n";
    }
    if (this.dog.color == "") {
      ret = false;
      msg += "Debe completar su color \n";
    }
    if (this.dog.descripcion == "") {
      ret = false;
      msg += "Debe completar la descripcion \n";
    }

    this.msgError = msg;
    return ret;
  }

  // ************* SUBIR IMAGENES
  galleryDog: any = [];
  imageURI: any;
  img1:boolean=false;
  img2:boolean=false;
  img3:boolean=false;
  img4:boolean=false;
  img5:boolean=false;
  imageFileName1: any;
  imageFileName2: any;
  imageFileName3: any;
  imageFileName4: any;
  imageFileName5: any;

  getImage(index) {
    const options = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      correctOrientation: true,
      targetWidth: 400,
      targetHeight: 400
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        console.log("IMAGE DATA IS", imageData);
        switch(index){
          case 1:
            this.imageFileName1 = 'data:image/jpeg;base64,' + imageData;
            this.img1 = true;
            this.galleryDog.push(this.imageFileName1);
          break;
          case 2:
            this.imageFileName2 = 'data:image/jpeg;base64,' + imageData;
            this.img2 = true;
            this.galleryDog.push(this.imageFileName2);
          break;
          case 3:
            this.imageFileName3 = 'data:image/jpeg;base64,' + imageData;
            this.img3 = true;
            this.galleryDog.push(this.imageFileName3);
          break;
          case 4:
            this.imageFileName4 = 'data:image/jpeg;base64,' + imageData;
            this.img4 = true;
            this.galleryDog.push(this.imageFileName4);
          break;
          case 5:
            this.imageFileName5 = 'data:image/jpeg;base64,' + imageData;
            this.img5 = true;
            this.galleryDog.push(this.imageFileName5);
          break;
        }
        //this.uploadFile();
      })
      .catch(e => {
        console.log("Error while picking from gallery", e);
      });
  }


  editarImagenes(imageParams){
    console.log('imageParams',imageParams);
    
    if(imageParams.length > 0){
      let index = 1;
      let url = 'https://ctrlztest.com.ar/lupacan/apirest/'
      console.log('entro');
      imageParams.map(img=>{
        switch(index){
          case 1:
            this.imageFileName1 = url+img['fotourl'];
            this.img1 = true;
          break;
          case 2:
            this.imageFileName2 = url+img['fotourl'];
            this.img2 = true;
          break;
          case 3:
            this.imageFileName3 = url+img['fotourl'];
            this.img3 = true;
          break;
          case 4:
            this.imageFileName4 = url+img['fotourl'];
            this.img4 = true;
          break;
          case 5:
            this.imageFileName5 = url+img['fotourl'];
            this.img5 = true;
          break;
        }
        index++;
      })
    }
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditDogUserPage');

    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
    });
  }

  edit(){
    console.log('dog', this.dog);
    console.log('dog', this.galleryDog);    
    if (this.validacion()) {
      this.services.updateDog(this.dog, this.galleryDog).subscribe(x => {
          let loading = this.loadingCtrl.create({
            content: 'Esper por favor...',
            spinner: 'circles'
          });
          loading.present();
        console.log('createDog', x);
        this.dataCreate = JSON.parse(x['_body'])['data'];
        if (this.dataCreate == 'inserted') {
          this.msgError = 'Listo!\n Se editó tu mascota.'
          loading.dismiss();
          this, this.presentToast(this.msgError);
          setTimeout(() => {
            //this.navCtrl.pop();
            this.navCtrl.setRoot(MenuPage);
          }, 500)
        } else {
          this.msgError = 'Hubo un error, vuelve a intentarlo mas tarde...'
          loading.dismiss();
          this, this.presentToast(this.msgError);
        }
      })
    } else {
      this.presentToast(this.msgError);
    }
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom"
    });

    toast.onDidDismiss(() => {
      console.log("Dismissed toast");
    });

    toast.present();
  }

  

}
