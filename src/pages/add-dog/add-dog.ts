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
  public razas: any = [
    {
      name: "Mestizo"
    },
    {
      name: "Labrador"
    },
    {
      name: "Bulldog"
    },
    {
      name: "Bulldog francés"
    },
    {
      name: "Caniche"
    },
    {
      name: "Pastor Alemán"
    },
    {
      name: "Beagle"
    },
    {
      name: "Golden"
    },
    {
      name: "Pug"
    },
    {
      name: "Pitbull"
    },
    {
      name: "Chihuahua"
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private DomSanitizer: DomSanitizer
  ) {
    this.initializeItems();
  }

  searchQuery: string = "";
  lugares: string[];

  initializeItems() {
    this.lugares = ["Amsterdam", "Bogota", "Buenos Aires"];
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddDogPage");
  }

  irAAgregar() {
    this.navCtrl.push(AddDogPage);
  }

  agregarFoto() {}

  irAHome(
    nombre,
    nacimiento,
    gender,
    raza,
    color,
    estado,
    size,
    lugar,
    descripcion
  ) {
    console.log(
      "Nombre: ",
      nombre,
      "Nacimiento: ",
      nacimiento,
      "Gender: ",
      gender,
      "Raza: ",
      raza,
      "Color: ",
      color,
      "Estado: ",
      estado,
      "Size: ",
      size,
      "Lugar: ",
      lugar,
      "Descripcion: ",
      descripcion
    );

    // this.navCtrl.push(HomePage);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      this.lugares = this.lugares.filter(item => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  // ************* SUBIR IMAGENES

  imageURI: any;
  imageFileName: any;

  getImage() {
    var options = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        console.log("IMAGE DATA IS", imageData);
        this.imageFileName = `data:image/jpeg;base64,${imageData}`;
        this.uploadFile();
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
