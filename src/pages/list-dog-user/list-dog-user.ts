import { Storage } from '@ionic/storage';
import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { IntDogUserPage } from './../int-dog-user/int-dog-user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { PerfilCallejeritoPage } from '../perfil-callejerito/perfil-callejerito';

@Component({
  selector: 'page-list-dog-user',
  templateUrl: 'list-dog-user.html',
})
export class ListDogUserPage {

  imgSrc: any;
  nombreUser: String;
  apellidoUser: String;
  telefonoUser: String;
  idUser: any;
  misPerros: any = [];
  user: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storage: Storage,
    private services: ApiProvider
  ) {
  }

  ionViewWillEnter() {
    if (this.navParams.data.user) {
      this.idUser = this.navParams.data.user['usuarioid'];
      this.services.getUser(this.idUser).subscribe(x => {
        console.log('datUser', x);
        this.user = x['data'];
        if (this.user.facebookid != "0" && this.user.imagen == "") {
          this.imgSrc = "https://graph.facebook.com/" + this.user.facebookid + "/picture?type=large";
        } else if (this.user.imagen != "") {
          this.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + this.user.imagen
        } else {
          this.imgSrc = 'assets/imgs/1.jpg';
        }
        this.nombreUser = this.user['nombre'];
        this.apellidoUser = this.user['apellido'];
        this.telefonoUser = this.user['telefono'];
        this.services.getMyDogs(this.idUser).subscribe(data => {
          console.log('vuelta', data);
          this.misPerros = data['data'];
        })
      })
    }
    if (this.navParams.data.id) {
      this.idUser = this.navParams.data.id;
      this.services.getUser(this.idUser).subscribe(x => {
        console.log('datUser', x);
        this.user = x['data'];
        if (this.user.imagen == "" && this.user.facebookid != "0") {
          this.imgSrc = "https://graph.facebook.com/" + this.user.facebookid + "/picture?type=large";
        } else if (this.user.imagen != "") {
          this.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + this.user.imagen
        } else {
          this.imgSrc = 'assets/imgs/1.jpg';
        }
        this.nombreUser = this.user['nombre'];
        this.apellidoUser = this.user['apellido'];
        this.telefonoUser = this.user['telefono'];
        this.services.getMyDogs(this.idUser).subscribe(data => {
          console.log('vuelta', data);
          this.misPerros = data['data'];
        })
      })
    }
    if (this.navParams.data.userName) {
      this.nombreUser = this.navParams.get('userName');
      this.idUser = this.navParams.get('id');
      console.log(this.idUser);
      this.services.getMyDogs(this.idUser).subscribe(data => {
        console.log('vuelta', data);
        this.misPerros = data['data'];
      })
    }
  }

  //Chat
  goToChat() {
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.navCtrl.push(ChatPage, { userChat: this.user, origenid: val['usuarioid'], tipoorigen: 'usuario', destinoid: this.idUser, tipodestino: 'usuario', conversandocon: this.nombreUser });
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDogUserPage');
    console.log('data', this.navParams.data);
  }

  goToDogDetail(dog) {
    if (dog.estado == '5') {
      this.navCtrl.push(PerfilCallejeritoPage,  {dogDetail: dog});
    }
    else {
      this.navCtrl.push(PhotoSliderPage, {
        dogDetail: dog,
        isMyDogs: false,
        vuelta: true, pageId:
          this.navParams.get('pageId')
      });
    }
  }

}
