import { MyServicesPage } from './../my-services/my-services';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform, ToastController, LoadingController, Events } from 'ionic-angular';
import { ModalOfferedServicesPage } from '../modal-offered-services/modal-offered-services';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { ServiceListPage } from '../service-list/service-list';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';


@IonicPage()
@Component({
  selector: 'page-edit-service',
  templateUrl: 'edit-service.html',
})
export class EditServicePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  catSelected: any = null;
  categorias: any;
  private service: any;
  servicios: any = []
  imagenes: any = [];
  imagePath: any;
  imageToEdit: any;
  base64Image: any;
  horariocierre: any;
  horarioapertura: any;
  imagenEdit: boolean = true;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  dias: any = [
    {
      i: 0, dia: 'Lunes', abre: this.navParams.data.horarios[1].lunesabre, cierra: this.navParams.data.horarios[1].lunescierra, desabilitar: false
    },
    {
      i: 1, dia: 'Martes', abre: this.navParams.data.horarios[2].martesabre, cierra: this.navParams.data.horarios[2].martescierra, desabilitar: false
    },
    {
      i: 2, dia: 'Miércoles', abre: this.navParams.data.horarios[3].miercolesabre, cierra: this.navParams.data.horarios[3].miercolescierra, desabilitar: false
    },
    {
      i: 3, dia: 'Jueves', abre: this.navParams.data.horarios[4].juevesabre, cierra: this.navParams.data.horarios[4].juevescierra, desabilitar: false
    },
    {
      i: 4, dia: 'Viernes', abre: this.navParams.data.horarios[5].viernesabre, cierra: this.navParams.data.horarios[5].viernescierra, desabilitar: false
    },
    {
      i: 5, dia: 'Sábado', abre: this.navParams.data.horarios[6].sabadoabre, cierra: this.navParams.data.horarios[6].sabadocierra, desabilitar: false
    },
    {
      i: 6, dia: 'Domingo', abre: this.navParams.data.horarios[0].domingoabre, cierra: this.navParams.data.horarios[0].domingocierra, desabilitar: false
    }
  ];
  tienda: any = {
    localid: this.navParams.data.localid,
    nombre: this.navParams.data.nombre || "",
    direcc: this.navParams.data.direccion || "",
    email: this.navParams.data.email || "",
    telefono: this.navParams.data.telefono || "",
    localidad: this.navParams.data.localidad || "",
    horarios: this.dias,
    usuarioid: this.navParams.data.usuarioid,
    placeid: this.navParams.data.placeid || "",
  }
  selectOptions = {
    title: 'Categorias',
    subTitle: 'Selecciona las categorias para tu tienda!',
    mode: 'md'
  };
  private win: any = window;
  constructor(
    public events:Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private api: ApiProvider,
    public platform: Platform,
    private camera: Camera,
    public maps: GoogleMapsProvider,
    public crop: Crop,
    private base64: Base64,
    public loading: LoadingController,
    public toastController: ToastController
  ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
    this.service = this.navParams.data;
    console.log('service', this.service)
    this.imageToEdit = "https://ctrlztest.com.ar/lupacan/apirest/" + this.navParams.data['imagenes'][0]['imagen'];
    console.log('this.imageToEdit', this.imageToEdit);
    this.controlHorarios();
    this.catSelected = this.service.categorias;
    this.editarImagenes(this.navParams.data.imagenes);
    this.query = this.navParams.data.direccion;
  }

  ionViewWillEnter() {
    this.getCateg();
  }

  controlHorarios() {
    this.dias.map(dia => {
      if (dia.abre == '0' || dia.cierra == '0') {
        dia.desabilitar = true;
      }
    })
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

  getCateg() {
    let cate = [];
    this.api.getCategories().subscribe(cat => {
      console.log('cat', cat);
      this.categorias = cat['data'];
        console.log('catSelect', this.catSelected);
    })
  }

  eliminarCategoria(index) {
    console.log('index', index);
    console.log('antes', this.catSelected[0]);
    this.catSelected[0].splice(index, 1);
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
    console.log('ionViewDidLoad EditServicePage');
  }

  openModal(characterNum) {

    let modal = this.modalCtrl.create(ModalOfferedServicesPage, characterNum);
    modal.present();
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

  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Hubo un error!\n Vuleve a intentarlo.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }


  editService() {
    let loading = this.loading.create({
      spinner: 'hide',
      content: 'Espere por favor...'
    });
    loading.present();
    let data;
    console.log('this.catSelected[0]_data', this.catSelected[0]);
    console.log('this.catSelected[0]', this.catSelected.length);
    if (this.catSelected.length > 0) {
      this.servicios = this.catSelected.map(x => { return x.categorialocalid });
    }
    console.log('tienda', this.tienda);
    console.log('categorias', this.servicios);
    console.log('imagenes', this.imagenes);
    loading.dismiss();
    //console.log('servSelec', this.servicios);
    //console.log('imagene', this.imagenes);    
    this.api.updateService(this.tienda, this.servicios, this.imagenes).subscribe(x => {
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
          this.events.publish('new-service');
        }, 500);
      }
    },err => {loading.dismiss();})
    console.log('dias', this.tienda);
  }


  deleteService() {
    this.showAlert();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Aviso!',
      subTitle: 'Esta seguro que desea eliminar este servicio?',
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
            this.api.deleteLocal(this.service['localid']).subscribe(x => {
              this.servicioEliminado();
            })
          }
        }
      ]
    });

    alert.present();

  }

  // ************* SUBIR IMAGENES
  galleryService: any = [];
  imageURI: any;
  img1:boolean=false;
  img2:boolean=false;
  img3:boolean=false;
  imageFileName1: any;
  imageFileName2: any;
  imageFileName3: any;

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
            this.galleryService.push(this.imageFileName1);
          break;
          case 2:
            this.imageFileName2 = 'data:image/jpeg;base64,' + imageData;
            this.img2 = true;
            this.galleryService.push(this.imageFileName2);
          break;
          case 3:
            this.imageFileName3 = 'data:image/jpeg;base64,' + imageData;
            this.img3 = true;
            this.galleryService.push(this.imageFileName3);
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
            this.imageFileName1 = url+img['imagen'];
            this.img1 = true;
          break;
          case 2:
            this.imageFileName2 = url+img['imagen'];
            this.img2 = true;
          break;
          case 3:
            this.imageFileName3 = url+img['imagen'];
            this.img3 = true;
          break;
        }
        index++;
      })
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
    if (this.imagePath != this.imageToEdit) {
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
      this.imagenEdit = false;
    }, error => {
      console.log('error_Crop', error);
    })
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\nServicio editado.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
    const startIndex = this.navCtrl.getActive().index - 1;
    this.navCtrl.remove(startIndex, 1);
    this.navCtrl.pop();
  }

  async servicioEliminado() {
    const toast = await this.toastController.create({
      message: "Listo!\nServicio eliminado.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
    const startIndex = this.navCtrl.getActive().index - 1;
    this.navCtrl.remove(startIndex, 1);
    this.navCtrl.pop();
  }
}
