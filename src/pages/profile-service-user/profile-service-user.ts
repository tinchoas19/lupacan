import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditServicePage } from '../edit-service/edit-service';


@Component({
  selector: 'page-profile-service-user',
  templateUrl: 'profile-service-user.html',
})
export class ProfileServiceUserPage {
  dataService:any;
  expanded:boolean = false;
  apiUrl:any="http://ctrlztest.com.ar/lupacan/apirest/";
  comments:any=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider
  ) {
    this.dataService = this.navParams.data;
    console.log(this.dataService);
  }

  ionViewWillEnter(){
    this.api.getComments(this.dataService['localid']).subscribe(x=>{
      console.log('comments', x);
      this.comments = x['data'];
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileServiceUserPage');
  }

  goToService(service) {
    this.navCtrl.push(EditServicePage, service);
  }

  vercomentarios(){
    this.expanded = !this.expanded;
  }
}
