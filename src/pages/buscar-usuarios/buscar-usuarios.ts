import { MenuPage } from './../menu/menu';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

/**
 * Generated class for the BuscarUsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-buscar-usuarios',
  templateUrl: 'buscar-usuarios.html',
})
export class BuscarUsuariosPage {

  index: any;
  items: any= null;
  dogTransfer:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public toastController: ToastController,
    private api: ApiProvider
  ) {
    this.dogTransfer = this.navParams.data.dogTransfer;
    this.index = navParams.data.index;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuscarUsuariosPage');
    console.log('dodTrnas',this.dogTransfer);
    
  }


  getItems(ev: any) {
    let val = ev.target.value;
    console.log("val", val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '' && val.length > 2) {
      this.api.buscarUsuarios(val).subscribe(x=>{
        console.log('VUELTA_API_BUSCARUSUARIOS', x);
        this.items = x['data'];
        if(this.items.length>0){
          this.items.map(user=>{
            if (user.facebookid != '0') {
              user.imgSrc = "https://graph.facebook.com/" + user.facebookid + "/picture?type=large";
            } else if (user.imagen != "") {
              user.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + user.imagen
            } else {
              user.imgSrc = 'assets/imgs/1.jpg';
            }
          })
        }
      })
    }else{
      this.items = [];
    }
  }

  transferir(item){
    let tipo = 'transferencia';
    const confirm = this.alertCtrl.create({
      title: 'Transferir tu mascota',
      message: 'Estas seguro de transferir la tenencia completa de '+ this.dogTransfer.nombre+' a '+ item.nombre+'?',
      buttons: [
        {
          text: 'No',
          role:'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            //console.log('Agree clicked');
            this.api.enviarSolicitudTrasnfer(item.usuarioid, this.dogTransfer.perroid, tipo).subscribe(data=>{
              console.log('dataTrans',data);
              if(JSON.parse(data['_body'])['data'] == 'updated'){
                this.foundDog();
                this.items = null;
                this.navCtrl.setRoot(MenuPage);
              }
            })
          }
        }
      ]
    });
    confirm.present();
  }

  async foundDog() {
    const toast = await this.toastController.create({
      message: "Nos comunicaremos con\nel usuario seleccionado\ny te avisaremos su decisión!",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'x'
    });
    toast.present();
  }

  compartirTenencia(item){
    console.log('entro a tenencia',item);
    
    let tipo = 'tenencia';
    const confirm = this.alertCtrl.create({
      title: 'Compartir tenencia',
      message: 'Estas por compartir la tenecia de '+ this.dogTransfer.nombre+' con '+ item.nombre+'?',
      buttons: [
        {
          text: 'No',
          role:'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            //console.log('Agree clicked');
            this.api.enviarSolicitudTrasnfer(item.usuarioid, this.dogTransfer.perroid, tipo).subscribe(data=>{
              console.log('dataTrans',data);
              if(JSON.parse(data['_body'])['data'] == 'updated'){
                this.foundDog();
                this.items = null;
                this.navCtrl.setRoot(MenuPage);
              }
            })
          }
        }
      ]
    });
    confirm.present();
  }

}
