import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { IntDogUserPage } from './../int-dog-user/int-dog-user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-list-dog-user',
  templateUrl: 'list-dog-user.html',
})
export class ListDogUserPage {

  imgSrc:any;
  nombreUser:String;
  apellidoUser:String;
  telefonoUser:String;
  idUser:any;
  misPerros:any=[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private services: ApiProvider
  ) {
  }

  ionViewWillEnter(){
    if(this.navParams.data.id){
      //let user = this.navParams.data.user;
      //this.nombreUser = user['nombre'];
      this.idUser = this.navParams.data.id;
      this.services.getUser(this.idUser).subscribe(x=>{
        console.log('datUser', x);
        let user = x['data'];
        this.imgSrc="http://ctrlztest.com.ar/lupacan/apirest/"+user['imagen'];
        this.nombreUser=user['nombre'];
        this.apellidoUser=user['apellido'];
        this.telefonoUser=user['telefono'];
        this.services.getMyDogs(this.idUser).subscribe(data=>{
          console.log('vuelta', data);
          this.misPerros = data['data'];
        })
      })
    }
    if(this.navParams.data.userName){
      this.nombreUser = this.navParams.get('userName');
      this.idUser = this.navParams.get('id');
      console.log(this.idUser);
      this.services.getMyDogs(this.idUser).subscribe(data=>{
        console.log('vuelta', data);
        this.misPerros = data['data'];
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDogUserPage');
    console.log('data', this.navParams.data);
  }

  goToDogDetail(dog){
    this.navCtrl.push(PhotoSliderPage,{
      dogDetail: dog, 
      isMyDogs: false, 
      vuelta:true, pageId: 
      this.navParams.get('pageId')
    });
  }

}
