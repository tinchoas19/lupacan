import { ListChatsPage } from './../list-chats/list-chats';
import { RefugioPage } from './../refugio/refugio';
import { MyFavoritesPage } from './../my-favorites/my-favorites';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Badge } from '@ionic-native/badge';
import { MisNotificacionesPage } from './../mis-notificaciones/mis-notificaciones';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyDogsPage } from '../my-dogs/my-dogs';
import { MyProfilePage } from '../my-profile/my-profile';
import { FoundDogPage } from '../found-dog/found-dog';
import { CreateServicePage } from '../create-service/create-service';
import { MyServicesPage } from '../my-services/my-services';

@IonicPage()
@Component({
  selector: 'page-profile-settings',
  templateUrl: 'profile-settings.html',
})
export class ProfileSettingsPage {
  numberBadge:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private badge: Badge,
    private storage: Storage,
    private api: ApiProvider
  ) {
    
  }

  ionViewWillEnter(){
    this.badge.get().then(t=>{
      console.log('numberBadge',t);
      if(t == 0){
        this.getNumberNot();
      }else{
        this.badge.set(t);
        this.numberBadge = t;
      }
    });
  }

  getNumberNot(){
    this.storage.get('datauser').then(user=>{
      if(user!=null){
        this.api.getNotificacionesSinLeer(user['usuarioid']).subscribe(x=>{
          console.log('misNot',x['data']);
          let numberNot = Number(x['data']);
          console.log('misNot_Parse',numberNot);            
          this.badge.set(numberNot);
          this.numberBadge = numberNot;
        })
      }
    })
  }

  goToFavoritos(){
    this.navCtrl.push(MyFavoritesPage)
  }

  goToRefugios(){
    this.navCtrl.push(RefugioPage);
  }

  goToConversaciones(){
    this.navCtrl.push(ListChatsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileSettingsPage');
  }
  goToMyDogs() {
    this.navCtrl.push(MyDogsPage);
  }
  goToMyProfile() {
    this.navCtrl.push(MyProfilePage);
  }
  goToIFindADog() {
    this.navCtrl.push(FoundDogPage);
  }
  goToCreateService(){
    this.navCtrl.push(CreateServicePage);
  }
  goToCreateRefugio(){
    this.navCtrl.push(CreateServicePage, {refugio:true});    
  }
  goToMyServices(){
    this.navCtrl.push(MyServicesPage);
  }
  goToNotificaciones(){
    this.navCtrl.push(MisNotificacionesPage);
  }
}
