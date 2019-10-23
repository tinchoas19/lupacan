import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  Platform,
  ToastController,
  LoadingController
} from "ionic-angular";
import { AddDogPage } from "../add-dog/add-dog";
import { MisionPage } from "../mision/mision";
import { AgeValidator } from  '../../app/validators/age';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { MainPage } from '../main/main';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { MenuPage } from '../menu/menu';
import { UsernameValidator } from '../../app/validators/username';


@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  firebaseUserId: any;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  public myForm: FormGroup;
  public submitAttempt: boolean = false;
  private win: any = window;
  facebookid:any;
  imagePath:any;
  base64Image: any = null;
  dataUserId:any;
  imgFacebook:boolean=false;
  imgSrc:any;
  dataUser:any=[];
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public usernameValidator: UsernameValidator,
    public alertCtrl: AlertController,
    private api: ApiProvider,
    public platform: Platform,
    private camera: Camera,
    public crop: Crop,
    private base64: Base64,
    private storage: Storage,
    public toastController: ToastController,
    public maps: GoogleMapsProvider,
    public loadingCtrl: LoadingController
  ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
    this.myForm = formBuilder.group({
      nombre:['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      apellido:['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      telefono:['',Validators.required],      
      direccion:['', Validators.required],//Contener letras y espacios, y tener menos de 30 caracteres.
      edad:['',Validators.required],
      email:['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]), usernameValidator.checkUsername.bind(usernameValidator)],
      password:['',Validators.required]
    })
  }

  ionViewDidLoad() {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.maps.map);
      this.searchDisabled = false;
    });
    console.log('ionViewDidLoad Register');
  }

  ionViewWillEnter(){
    this.registroFb(this.navParams.data);
    this.getFirebaseUser();
  }

  getFirebaseUser(){
    this.storage.get('firebaseUserId').then(val=>{
      if(val){
        this.firebaseUserId = val;
      }
    });
  }

  selectPlace(place){
    console.log('placeSlected', place);  
    this.query = place.description;
    this.myForm.controls['direccion'].setValue(place.description);
    this.places = [];
  }


  aceptoterminos: boolean = false;

  searchPlace(){
    this.saveDisabled = true;
    console.log('query', this.query);
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

  registrarme() {
    this.submitAttempt = true;
    console.log('base64', this.base64Image);
    console.log(!this.myForm.value);    
    if(!this.myForm.valid || this.base64Image == null){
      this.showAlert();
    }else{
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Espere por favor...'
      });
      loading.present();
      console.log("success!")
      console.log(this.myForm.value);
      loading.dismiss();      
      this.api.createUser(this.myForm.value, this.base64Image,this.facebookid, this.firebaseUserId).subscribe(x=>{
        console.log('VUELTA_API_CREATEUSER', x);
        this.dataUser = JSON.parse(x['_body'])['data']
        if(this.dataUser > 0){
          this.dataUserId = this.dataUser;
          this.storage.set('userId', this.dataUserId);
          this.api.getUser(this.dataUserId).subscribe(dataUser=>{
            console.log('dataUser_login',dataUser);
            this.storage.set('datauser', dataUser['data']);
            loading.dismiss();
            this.presentToasteEx();
            setTimeout(()=>{
              this.navCtrl.setRoot(MenuPage, dataUser['data']);
            },700)
          })
        }else{
          loading.dismiss();
          this.presentToasteError();
        }
      })
    }
  }

  registroFb(params){
    this.imgFacebook=false;
    console.log('params', params);
    if(params.userFb || params.fbId){
      this.facebookid = params.fbId;
      this.imgFacebook = true;
      this.imgSrc = "https://graph.facebook.com/" + params.fbId + "/picture?type=large"
      this.toBase64(this.imgSrc);
      console.log('params.userFb', params.userFb);
      console.log('params.fbId', params.fbId);
      this.myForm.controls['nombre'].setValue(params.userFb.name);
      this.myForm.controls['email'].setValue(params.userFb.email);
      this.myForm.controls['edad'].setValue(params.userFb.birthday);
    }
  }

  check(event) {
    console.log(event.checked);

    if (event.checked == true) {
      this.aceptoterminos = true;
    } else {
      this.aceptoterminos = false;
    }
  }

  goTerminos(){
    const alert = this.alertCtrl.create({
      title: "Términos y condiciones",
      subTitle: "Por favor, enviar pagina para agregar como se veria.",
      buttons: ["Ok"]
    });
    alert.present();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!.No olvides cargar una imagen a tu perfil!",
      buttons: ["Ok"]
    });
    alert.present();
  }

  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Hubo un error!\n Vuleve a intentarlo. No olvides cargar una imagen a tu perfil!",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Se guardo tu registro.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

  addPerfilPhoto(){
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
    console.log('toBase64', filePath);
    this.base64.encodeFile(filePath).then((base64File: string) => {
      this.base64Image = base64File;
      console.log('yaconvert', this.base64Image);
    });
  }

  getTrustImg(){
    console.log('fn_muestra', this.imagePath);
    if(this.imagePath != "assets/imgs/1.jpg"){
      let path = this.win.Ionic.WebView.convertFileSrc(this.imagePath);
      console.log('fn_muestra_path',path);
      return path;
    }else{
      return this.imagePath;
    }
  }

  cropPicture(path){
    console.log('path_crop', path);
    let option={
      quality: 100,
      targetHeight: 100,
      targetWidth: 100
    };

    this.crop.crop(path, option).then(newImageCrop=>{
     this.imagePath = newImageCrop;
     console.log('imagen_cropeanda', newImageCrop);
     this.toBase64(newImageCrop);
    },error=>{
      console.log('error_Crop', error );
    })
  }
}
