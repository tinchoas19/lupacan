import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController } from 'ionic-angular';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  public userid: any;
  public myForm: FormGroup;
  public submitAttempt: boolean = false;
  private win: any = window;
  conFoto: boolean = false;
  imagePath: any;
  base64Image: any;
  imgSrc: any;
  direccionUser: any;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private camera: Camera,
    public crop: Crop,
    private base64: Base64,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    private storage: Storage,
    private api: ApiProvider,
    public maps: GoogleMapsProvider,
  ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
    /* this.imagePath = "assets/imgs/1.jpg"; */
    this.myForm = formBuilder.group({
      nombre: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      apellido: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      telefono: ['', Validators.required],
      edad: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.required]
    })
  }

  guardarCambio() {
    /*     if (!this.myForm.valid) {
          this.submitAttempt = true;
          this.showAlert();
        } else { */
    console.log("success!")
    console.log(this.myForm.value);
    this.api.updateUser(this.myForm.value, this.direccionUser, this.userid, this.base64Image).subscribe(x => {
      console.log('UPDATE_USER', x);
      let dataUser = JSON.parse(x['_body'])['data']
      if (dataUser) {
        //this.dataUserId = this.dataUser;
        this.storage.set('datauser', dataUser);
        this.presentToasteEx();
      }
    })
  }

  ionViewWillEnter() {
    this.verificarData();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Se actualizo tu perfil.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!",
      buttons: ["Ok"]
    });
    alert.present();
  }

  verificarData() {
    this.conFoto = false;
    this.storage.get('datauser').then(user => {
      console.log('my_profile_user', user);
      if (user != null) {
        this.conFoto = true;
        if (user.imagen == "" && user.facebookid != "") {
          this.imgSrc = "https://graph.facebook.com/" + user.facebookid + "/picture?type=large";
        } else if (user.imagen != "") {
          this.imgSrc = "http://ctrlztest.com.ar/lupacan/apirest/" + user.imagen
        } else {
          this.imgSrc = '../../assets/imgs/1.jpg';
        }
        this.userid = user.usuarioid;
        this.myForm.controls['nombre'].setValue(user.nombre);
        this.myForm.controls['apellido'].setValue(user.apellido);
        this.myForm.controls['password'].setValue(user.password);
        this.myForm.controls['telefono'].setValue(user.telefono);
        this.myForm.controls['edad'].setValue(user.fechanacimiento);
        this.myForm.controls['email'].setValue(user.email);
        this.query = this.direccionUser = user.direccion;
      }
    })
  }

  addPerfilPhoto() {
    const options = {
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true,
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
    });
  }

  getTrustImg() {
    console.log('fn_muestra', this.imagePath);
    if (this.imagePath != "assets/imgs/1.jpg") {
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
      this.toBase64(newImageCrop);
    }, error => {
      console.log('error_Crop', error);
    })
  }


  ionViewDidLoad() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
    });
    console.log('ionViewDidLoad MyProfilePage');
  }

  selectPlace(place) {
    console.log('placeSlected', place);
    this.query = place.description;
    this.direccionUser = this.query;
    this.places = [];
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

}
