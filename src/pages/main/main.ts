import { QrCollaresPage } from './../qr-collares/qr-collares';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { BuscarPage } from './../buscar/buscar';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AgregarPage } from '../agregar/agregar';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  mySelectedIndex: any;
  user:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private storage: Storage
  ) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }


  public homeTab = HomePage;
  public cuentaTab = QrCollaresPage;
  public agregarTab = AgregarPage;
  public buscatTab = BuscarPage;
  
  ionViewWillEnter(){
    this.storage.get('datauser').then(val=>{
      if(val != null){
        this.user = val;
        console.log('main_param', this.user);
      }
    })  
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
  }

}
