import { Storage } from '@ionic/storage';
import { ApiProvider, usuario } from './../../providers/api/api';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { HomePage } from "../home/home";
import { LoadingController, ToastController } from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { Camera, CameraOptions } from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: "page-add-dog",
  templateUrl: "add-dog.html"
})
export class AddDogPage {

  dog:any={
    usuarioid:'',
    nombre:'',
    nacimiento:'',
    gender:'',
    raza:'',
    color:'',
    estado:'',
    size:'',
    descripcion:''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private services : ApiProvider,
    private storage: Storage,
    private DomSanitizer: DomSanitizer
  ) {
    this.initializeItems();
  }

  searchQuery: string = "";
  lugares: string[];
  razas:any=[];
  colores:any=[];
  msgError:any;
  dataCreate:any=[];

  initializeItems() {
    this.storage.get('userData').then(x=>{
      if(x) this.dog['usuarioid'] = x['usuarioid'];
      console.log('ja',this.dog.usuarioid)
    })
    this.services.getBreed().subscribe(data=>{
      console.log('raza', data);
      this.razas = data['data']['colores'];
      this.colores = data['data']['razas'];
    })
    this.lugares = ["Amsterdam", "Bogota", "Buenos Aires"];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddDogPage");
  }

  irAAgregar() {
    this.navCtrl.push(AddDogPage);
  }

  agregarFoto() {}

  irAHome(){
    console.log('dog',this.dog);
    if(this.validacion()){
      this.services.createDog(this.dog, this.galleryDog).subscribe(x=>{
        console.log('createDog', x);
        this.dataCreate = JSON.parse(x['_body'])['data'];
        if(this.dataCreate == 'inserted'){
          this.msgError = 'Se agrego con Exito!'
          this,this.presentToast(this.msgError);
          setTimeout(()=>{
            this.navCtrl.pop();
          },2000)
        }else{
          this.msgError = 'Hubo un error, vuelve a intentarlo mas tarde...'
          this,this.presentToast(this.msgError);
        }
      })
    }else{
      this.presentToast(this.msgError);
    }
  }

  validacion() {
    let ret = true;
    let msg = "";

    if (this.dog.nombre == "") {
      ret = false;
      msg += "Debe completar el nombre\n";
    }
    if (this.dog.nacimiento == "") {
      ret = false;
      msg += "Debe completar la fecha de nacimiento";
    }
    if (this.dog.gender == "") {
      ret = false;
      msg += "Debe escoger un genero";
    }
    if (this.dog.raza == "") {
      ret = false;
      msg += "Debe escoger una raza";
    }
    if (this.dog.color == "") {
      ret = false;
      msg += "Debe completar su color";
    }
    if (this.dog.estado == "") {
      ret = false;
      msg += "Debe completar su estado";
    }
    if (this.dog.size == "") {
      ret = false;
      msg += "Debe escoger un tamaño";
    }
    if (this.dog.descripcion == "") {
      ret = false;
      msg += "Debe completar la descripcion";
    }

    this.msgError = msg;
    return ret;
  }

  // ************* SUBIR IMAGENES
  galleryDog:any=[];
  imageURI: any;
  imageFileName: any;

  getImage() {
    const options = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false,
      allowEdit: true,
      targetWidth:400,
      targetHeight:400
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        console.log("IMAGE DATA IS", imageData);
        this.imageFileName = 'data:image/jpeg;base64,'+imageData;
        this.galleryDog.push(this.imageFileName);
        //this.uploadFile();
      })
      .catch(e => {
        console.log("Error while picking from gallery", e);
      });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: "ionicfile",
      fileName: "ionicfile",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    };

    fileTransfer.upload(this.imageURI, "http://uploadImage", options).then(
      data => {
        console.log(data + " Uploaded Successfully");
        this.imageFileName = this.imageURI;
        //   "http://192.168.0.7:8080/static/images/ionicfile.jpg";
        loader.dismiss();
        this.presentToast("Image uploaded successfully");
      },
      err => {
        console.log(err);
        loader.dismiss();
        this.presentToast(err);
      }
    );
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

  img1: any;
}
