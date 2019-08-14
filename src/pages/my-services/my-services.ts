import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { ProfileServiceUserPage } from './../profile-service-user/profile-service-user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider
  ) {
    this.services = [
      {
        "serviceId": 1,
        "serviceName": "Vererinaria Patito",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 2,
        "serviceName": "Vererinaria Patito2",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      }
    ];
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
              if(cat.categorialocalid == '9'){
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
