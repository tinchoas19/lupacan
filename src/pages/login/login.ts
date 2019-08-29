import { ApiProvider } from './../../providers/api/api';
import { RecuperoPassPage } from '../recupero-pass/recupero-pass';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { MainPage } from '../main/main';
import { Storage } from '@ionic/storage';
import { MenuPage } from '../menu/menu';

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {

  dataUsuario:any=[];
  firebaseUserId:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private services: ApiProvider,
    private fb: Facebook,
    private storage: Storage,
    public alertCtrl: AlertController,
    public toastController: ToastController
  ) {
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  ionViewWillEnter(){
    this.getFirebaseUser();
  }

  getFirebaseUser(){
    this.storage.get('firebaseUserId').then(val=>{
      if(val){
        this.firebaseUserId = val;
      }
    });
  }

  login(usuario, password) {
    if(usuario != "" && password != ""){
      this.services.validarUsuario(this.firebaseUserId,usuario, password).subscribe(x=>{
        console.log('vueltaValidaUser',x['data']);
        if(x['data']['usuarioid'] > 0){
          this.services.getUser(x['data']['usuarioid']).subscribe(dataUser=>{
            this.dataUsuario = x['data']['usuarioid'];
            console.log('dataUser_login',dataUser);
            this.storage.set('datauser', dataUser['data']);
                this.presentToasteEx();
                setTimeout(()=>{
                  this.navCtrl.setRoot(MenuPage, dataUser['data']);
                },700)
          })
        }else{
          this.showAlert();
        }
      })
    }else{
      this.showAlert();
    }
  }

  registro() {
    this.navCtrl.push(RegisterPage);
  }

  recuperoPass(){
    this.navCtrl.push(RecuperoPassPage);
  }

  //----FACEBOOK------
  loginAction(){
    // Login with permissions
    this.fb.login(['public_profile', 'user_photos', 'email', 'user_birthday'])
    .then( (res: FacebookLoginResponse) => {
      console.log('resFB', res);
        // The connection was successful
        if(res.status == "connected") {

            // Get user ID and Token
            var fb_id = res.authResponse.userID;
            var fb_token = res.authResponse.accessToken;
            this.fb.api("/me?fields=name,gender,birthday,email", []).then((user) => {
              
                // Get the connected user details
                var gender    = user.gender;
                var birthday  = user.birthday;
                var name      = user.name;
                var email     = user.email;

                console.log("=== USER INFOS ===");
                console.log("Gender : " + gender);
                console.log("Birthday : " + birthday);
                console.log("Name : " + name);
                console.log("Email : " + email);

                // => Open user session and redirect to the next page
              //this.navCtrl.push(RegisterPage,{userFb:user, fbId: fb_id});
              this.services.validarUserFb(fb_id, this.firebaseUserId,name,email).subscribe(x=>{
                console.log('dataFB',x);
                this.services.getUser(x['data']['usuarioid']).subscribe(user=>{
                  console.log('fbbbbb', user);
                  this.storage.set('datauser', user['data']);
                  this.presentToasteEx();
                  setTimeout(()=>{
                    this.navCtrl.setRoot(MenuPage, user['data']);
                  },700)
                })
              })
            });
        } 
        // An error occurred while loging-in
        else {
            this.presentToasteError();
            console.log("An error occurred...");
        }

    })
    .catch((e) => {
        console.log('Error logging into Facebook', e);
    });
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!",
      buttons: ["Ok"]
    });
    alert.present();
  }


  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Hubo un error!\n Vuleve a intentarlo.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async presentToasteEx() {
    const toast = await this.toastController.create({
      message: "Listo!\n Bienvenido a LupaCan!",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
