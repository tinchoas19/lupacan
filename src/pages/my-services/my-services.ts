import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { ProfileServiceUserPage } from './../profile-service-user/profile-service-user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { EditServicePage } from '../edit-service/edit-service';


@IonicPage()
@Component({
  selector: 'page-my-services',
  templateUrl: 'my-services.html',
})
export class MyServicesPage {
  private services: any[];
  misLocales:any=[];
  misRefugios:any=[];
  refugio:any;
  constructor(
    public events: Events,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider
  ) {
    console.log("params", this.navParams.data);
    this.refugio = this.navParams.data.refugio;    
    this.events.subscribe('edit-service', ()=>{
      this.refugio = false
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyServicesPage');
  }

  ionViewWillEnter(){
    this.misRefugios=[];
    this.misLocales=[];
    this.storage.get('datauser').then(val=>{
      if(val){
        console.log('valUser_servicios',val)
        this.api.getMisLocales(val['usuarioid']).subscribe(x=>{
          let data = x['data'];
          data.map(local=>{
            local.categorias.map(cat=>{
              if(cat.categoriaid == '9'){
                local.refugio = true;
              }else{
                local.refugio = false;
              }
            })
            if(local.refugio){
              this.misRefugios.push(local);
            }else{
              this.misLocales.push(local);
            }
          })
          console.log('da', data);
        })
      }
    })
  }

  goToProfileService(service){
    this.navCtrl.push(ProfileServiceUserPage, service);
  }
  
  goToService(service) {
    this.navCtrl.push(EditServicePage, service);
  }
}
