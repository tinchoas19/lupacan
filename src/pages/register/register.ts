import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { AddDogPage } from "../add-dog/add-dog";
import { MisionPage } from "../mision/mision";

@IonicPage()
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {}

  aceptoterminos: boolean = false;

  registrarme(nombre, edad, email, password) {
    console.log(nombre, edad, email, password, this.aceptoterminos);

    if (nombre && edad && email && password && this.aceptoterminos) {
      this.navCtrl.push(MisionPage);
    } else {
      this.showAlert();
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

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!",
      buttons: ["Ok"]
    });
    alert.present();
  }
}
