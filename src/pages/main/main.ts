import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { BuscarPage } from './../buscar/buscar';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProfileSettingsPage } from '../profile-settings/profile-settings';
import { AgregarPage } from '../agregar/agregar';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  user:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private storage: Storage
  ) {
    /* if(this.navParams.data.user){
      this.api.getUser(this.navParams.data.user).subscribe(user=>{
        console.log('dataUser', user);
        if(user['data']){
          this.user = user['data'];
          console.log('main_param', user);
          this.storage.set('usuario', user['data']);
        }
      })
    }  */
  }


  public homeTab = HomePage;
  public cuentaTab = ProfileSettingsPage;
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
