import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-found-dog",
  templateUrl: "found-dog.html"
})
export class FoundDogPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad FoundDogPage");
  }

  publicar(nombre, apellido, raza, color, email, size, sexo, direccion, fecha) {
    console.log(
      "Nombre: ",
      nombre,
      "Apellido: ",
      apellido,
      "Raza: ",
      raza,
      "Color: ",
      color,
      "Email: ",
      email,
      "Size: ",
      size,
      "Sexo: ",
      sexo,
      "Direccion: ",
      direccion,
      "Fecha: ",
      fecha
    );
    if (
      nombre &&
      apellido &&
      raza &&
      color &&
      email &&
      size &&
      sexo &&
      direccion &&
      fecha
    ) {
      console.log("Hace algo");
    } else {
      this.showAlert();
    }
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!",
      buttons: ["Ok"]
    });
    alert.present();
  }
}
