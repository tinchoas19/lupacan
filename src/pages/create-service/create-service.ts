import { MyServicesPage } from './../my-services/my-services';
import { LoadingController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController, ToastController } from 'ionic-angular';
import { ModalOfferedServicesPage } from '../modal-offered-services/modal-offered-services';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-create-service',
  templateUrl: 'create-service.html',
})
export class CreateServicePage {
  catSelected: any = null;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  private win: any = window;
  dias: any = [
    {
      i: 0, dia: 'Lunes', abre: "", cierra: "", desabilitar: false
    },
    {
      i: 1, dia: 'Martes', abre: "", cierra: "", desabilitar: false
    },
    {
      i: 2, dia: 'Miércoles', abre: "", cierra: "", desabilitar: false
    },
    {
      i: 3, dia: 'Jueves', abre: "", cierra: "", desabilitar: false
    },
    {
      i: 4, dia: 'Viernes', abre: "", cierra: "", desabilitar: false
    },
    {
      i: 5, dia: 'Sábado', abre: "", cierra: "", desabilitar: false
    },
    {
      i: 6, dia: 'Domingo', abre: "", cierra: "", desabilitar: false
    }
  ];
  tienda: any = {
    nombre: "",
    direcc: "",
    email: "",
    telefono: "",
    horaA: "",
    horaC: "",
    localidad: "",
    category: "",
    horarios: this.dias,
    usuarioid: "",
    placeid: "",
  }

  lun: boolean = false;
  imagenes: any = [];
  imagePath: any;
  base64Image: any;
  categorias: any = [];
  servicios: any = []
  dataService: any = null;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  refugio: boolean = false;
  selectOptions = {
    title: 'Categorias',
    subTitle: 'Selecciona las categorias para tu tienda!',
    mode: 'md'
  };
  constructor(
    public event: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    public modalCtrl: ModalController,
    public platform: Platform,
    private camera: Camera,
    public crop: Crop,
    public maps: GoogleMapsProvider,
    private base64: Base64,
    private storage: Storage,
    public toastController: ToastController,
    public loading: LoadingController
  ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
    this.imagePath = null;

  }

  apertura(dia) {
    if (dia.i == 0) {
      this.dias.map(day => {
        day.abre = dia.abre;
      })
    }
    console.log('aper', dia);
  }

  cierre(dia) {
    if (dia.i == 0) {
      this.dias.map(day => {
        day.cierra = dia.cierra;
      })
    }
    console.log('aper', dia);
  }

  noAbre(dia, event) {
    if (event.checked) {
      dia.desavilitar = true;
      dia.abre = "0";
      dia.cierra = "0";
    } else {
      dia.abre = "";
      dia.cierra = "";
      dia.desabilitar = false;
    }
  }


  ionViewWillEnter() {

    this.storage.get('datauser').then(val => {
      if (val) {
        this.tienda.usuarioid = val['usuarioid']
      }
    })
    if (this.navParams.data.refugio) {
      this.refugio = true;
      this.catSelected = [];
      this.catSelected.push({ categorialocalid: "9", nombre: "Refugios", icono: "upload/icon/cat-refugios.png" });
      console.log('ref', this.catSelected);
    } else {
      this.getCateg();
    }
  }

  openModal(characterNum) {
    let modal = this.modalCtrl.create(ModalOfferedServicesPage, characterNum);
    modal.present();
    modal.onDidDismiss((data) => {
      console.log('data', data);
      this.dataService = data;
      if (data.length > 0) {
        data.map(serv => {
          this.servicios.push(serv.servicioid);
          console.log('servicios', this.servicios);
        })
      }
    });
  }

  getCateg() {
    this.api.getCategories().subscribe(cat => {
      console.log('cat', cat);
      this.categorias = cat['data'];
    })
  }

  eliminarCategoria(index) {
    console.log('index', index);
    console.log('antes', this.catSelected);
    this.catSelected.splice(index, 1);
    console.log('desp-elimino', this.catSelected);
  }

  getItem(cat) {
    console.log('at', cat);
    this.catSelected = cat;
    console.log('cats', this.catSelected);
    /* this.categoria = cod_operativo;//Aquí envío el valor seleccionado
    this.getInventoryList(); *///Ésta es la función que traerá el servicio que necesito
  }


  ionViewDidLoad() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
    });
    console.log('ionViewDidLoad CreateServicePage');
  }


  selectPlace(place) {
    this.query = place.description;
    this.tienda.direcc = this.query;
    this.tienda.placeid = place.place_id
    this.tienda.localidad = place.structured_formatting.secondary_text.split(',')[0];
    console.log('localidad', this.tienda.localidad);
    this.places = [];
    console.log('placeSlected', place);
  }

  addService() {
    console.log('this.catSelected[0]_data', this.catSelected);
    //console.log('this.catSelected[0]', this.catSelected.length);
    let loading = this.loading.create({
      spinner: 'hide',
      content: 'Please Wait...'
    });
    loading.present();
    let data;
    if(this.catSelected != null){
      if (this.catSelected.length > 0) {
        this.servicios = this.catSelected.map(x => { return x.categorialocalid });
        //console.log('imagene', this.imagenes);    
        this.api.createService(this.tienda, this.servicios, this.imagenes).subscribe(x => {
          console.log('VUELTA_API_CREATESERVICE', x);
          data = JSON.parse(x['_body'])['status_message'];
          console.log('data_service_created', data);
          if (data != "event created") {
            this.presentToasteError();
            loading.dismiss();
          } else {
            this.presentToasteEx()
            loading.dismiss();
            setTimeout(() => {
              this.navCtrl.pop();
              this.event.publish('new-service');
            }, 500);
          }
        })
      }
    }else {
      loading.dismiss();
      this.presentToasteErrorCat();
    }
    console.log('tienda', this.tienda);
    console.log('categorias', this.servicios)
    console.log('dias', this.tienda);

  }


  searchPlace() {
    this.saveDisabled = true;
    console.log('query', this.query);
    if (this.query.length > 0 && !this.searchDisabled) {
      let config = {
        types: ['geocode'],
        input: this.query
      }
      console.log('query', this, this.query);
      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
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

  addPerfilPhoto() {
    const options = {
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true,
      correctOrientation: true
    };

    this.camera.getPicture(options)
      .then((fileUri) => {
        console.log('fileUri_camara', fileUri);
        // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
        // Only giving an android example as ionic-native camera has built in cropping ability
        if (this.platform.is('ios')) {
          return fileUri
        } else if (this.platform.is('android')) {
          // Modify fileUri format, may not always be necessary
          fileUri = 'file://' + fileUri;

          /* Using cordova-plugin-crop starts here */
          this.cropPicture(fileUri);
        }
      })
  }

  toBase64(filePath) {
    this.base64.encodeFile(filePath).then((base64File: string) => {
      this.base64Image = base64File;
      this.imagenes.push(this.base64Image);
    });
  }

  getTrustImg() {
    console.log('fn_muestra', this.imagePath);
    if (this.imagePath != "assets/imgs/vet.jpg") {
      let path = this.win.Ionic.WebView.convertFileSrc(this.imagePath);
      console.log('fn_muestra_path', path);
      return path;
    } else {
      return this.imagePath;
    }
  }

  cropPicture(path) {
    console.log('path_crop', path);
    let option = {
      quality: 100,
      targetHeight: 100,
      targetWidth: 100
    };

    this.crop.crop(path, option).then(newImageCrop => {
      this.imagePath = newImageCrop;
      console.log('imagen_cropeanda', newImageCrop);
      this.toBase64(this.imagePath);
    }, error => {
      console.log('error_Crop', error);
    })
  }


  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Hubo un error!\n Vuleve a intentarlo.",
      duration: 2500,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteErrorCat() {
    const toast = await this.toastController.create({
      message: "Debes seleccionar al menos una categoria!",
      duration: 2500,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Servicio agregado.",
      duration: 2500,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
