import { MenuPage } from './../menu/menu';
import { Storage } from '@ionic/storage';
import { ListChatsServicePage } from './../list-chats-service/list-chats-service';
import { DescuentosPage } from './../descuentos/descuentos';
import { SlidePremiumPage } from './../slide-premium/slide-premium';
import { AddDogPage } from './../add-dog/add-dog';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { EditServicePage } from '../edit-service/edit-service';
import { PhotoSliderPage } from '../photo-slider/photo-slider';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';


@Component({
  selector: 'page-profile-service-user',
  templateUrl: 'profile-service-user.html',
})
export class ProfileServiceUserPage {
  @ViewChild('input') myInput ;

  dataService:any;
  expanded:boolean = false;
  mostrarDescuentos:boolean = false;
  apiUrl:any="https://ctrlztest.com.ar/lupacan/apirest/";
  comments:any=[];
  dogsRefugio:any;
  userId:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    public toastController: ToastController,
    private storage: Storage,
    public modalCtrl: ModalController,
    private iab: InAppBrowser
  ) {
    this.dataService = this.navParams.data;
    console.log(this.dataService);
  }

  cargarUser(){
    this.storage.get('datauser').then(val=>{
      if(val!=null){
        this.userId = val['usuarioid'];
      }
    })
  }

  ionViewWillEnter(){
    this.cargarUser();
    this.api.getComments(this.dataService['localid']).subscribe(x=>{
      console.log('comments', x);
      this.comments = x['data'];
    })
    this.getRefugioDogs();
  }

  getRefugioDogs(){
    this.api.getMyDogRefugios(this.dataService['localid']).subscribe(x=>{
      console.log('x_dogsRefugio',x);
      this.dogsRefugio = x['data'];
    })
  }

  updateCucumber(){
    setTimeout(() => {
      this.myInput.setFocus();
    },150);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileServiceUserPage');
  }

  localPremium(){
    this.api.controlDecicidir().subscribe(x=>{
      if(x.name != ''){
        const target = '_blank';
        const link = 'http://ctrlztest.com.ar/lupacan/subscripcion/index.php?usuarioid=7&monto=150&email=martin@gmail.com.ar';
        const options: InAppBrowserOptions = {
          location: "no", //Or 'no'
          hidden: "no", //Or  'yes'
          clearcache: "yes",
          clearsessioncache: "yes",
          zoom: "yes", //Android only ,shows browser zoom controls
          hardwareback: "yes",
          mediaPlaybackRequiresUserAction: "no",
          shouldPauseOnSuspend: "no", //Android only
          closebuttoncaption: "Close", //iOS only
          disallowoverscroll: "no", //iOS only
          toolbar: "yes", //iOS only
          enableViewportScale: "no", //iOS only
          allowInlineMediaPlayback: "no", //iOS only
          presentationstyle: "pagesheet", //iOS only
          fullscreen: "yes" //Windows only
        };
        const refLink = this.iab.create(link,target,options);
        refLink.on('loadstart').subscribe((event: InAppBrowserEvent) => {
          var okUrl = 'http://ctrlztest.com.ar/lupacan/subscripcion/thankyou.php';
          if (event.url == okUrl) {
            refLink.close();//This will close InAppBrowser Automatically when closeUrl Started
            this.api.localPremium(this.dataService['localid'], 1).subscribe(x => {
              console.log('x_vuelta_premium', x);
              //this.ionViewWillEnter();
              this.presentToasteEx();
              setTimeout(()=>{
                this.navCtrl.setRoot(MenuPage);
              },500)
              //alert('Compra Success');
            });        
          }
          var errorUrl = 'http://ctrlztest.com.ar/lupacan/subscripcion/error.php';
          if (event.url == errorUrl) {
            refLink.close();//This will close InAppBrowser Automatically when closeUrl Started
            //this.navCtrl.push(ConfirmPage, false);
            this.presentToasteErr();
          }
        });
      }else{
        alert('Sin conexión en Decidir');
      }
    })
    
    //this.navCtrl.push(SlidePremiumPage, {localid: this.dataService['localid']})
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Se registró tu compra con éxito.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteErr() {
    const toast = await this.toastController.create({
      message: "Uups!\n Hubo un error, vuelve a intentarlo!",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  goToDogDetail(dog){
    this.navCtrl.push(PhotoSliderPage,{dogDetail: dog, isMyDogs: false});
  }

  goToService() {
    this.navCtrl.push(EditServicePage, this.dataService);
  }

  vercomentarios(){
    this.expanded = !this.expanded;
  }

  vercmensajes(){
    this.navCtrl.push(ListChatsServicePage,{localid: this.dataService['localid']})
  }

  verDescuentos(){
    let profileModal = this.modalCtrl.create(DescuentosPage,{localid:this.dataService['localid'], categorias:this.dataService['categorias']});
    profileModal.present();
  }

  addDog(){
    console.log('refugioid', this.dataService['localid'])
    this.navCtrl.push(AddDogPage,{refugio:true, refugioid: this.dataService['localid']});
  }
}
