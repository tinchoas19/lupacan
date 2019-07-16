import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
/*   user:any={
    nombre:'',
    apellido:'',
    email:'',
    direccion:'',
    tel:'',
    pass:'',
    nacimiento:''
  } */
  public userid:any;
  public myForm: FormGroup;
  public submitAttempt: boolean = false;
  private win: any = window;
  conFoto:boolean=false;
  imagePath:any;
  base64Image: any;
  imgSrc:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private camera: Camera,
    public crop: Crop,
    private base64: Base64,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    private storage: Storage,
    private api: ApiProvider
  ) {
    /* this.imagePath = "assets/imgs/1.jpg"; */
    this.myForm = formBuilder.group({
      nombre:['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      apellido:['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      telefono:['',Validators.required],      
      direccion:['',Validators.compose([Validators.maxLength(40), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      edad:['',Validators.required],
      email:['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password:['',Validators.required]
    })
  }

  guardarCambio() {
    if(!this.myForm.valid){
      this.submitAttempt = true;
      this.showAlert();
    }else{
      console.log("success!")
      console.log(this.myForm.value);
      this.api.updateUser(this.myForm.value,this.userid, this.base64Image).subscribe(x=>{
        console.log('UPDATE_USER', x);
        /* this.dataUser = JSON.parse(x['_body'])['data']
        if(this.dataUser > 0){
          this.dataUserId = this.dataUser;
          this.storage.set('userId', this.dataUserId);
          this.presentToasteEx();
        } */
      })
    }
  }

  ionViewWillEnter(){
    this.verificarData();
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: "Error!",
      subTitle: "Por favor, revisá los campos!",
      buttons: ["Ok"]
    });
    alert.present();
  }

  verificarData(){
    this.conFoto = false;
    this.storage.get('userData').then(user=>{
      console.log('my_profile_user', user);
      if(user!=null){
        this.conFoto = true;
        this.userid = user.usuarioid;
        this.imgSrc = "http://ctrlztest.com.ar/lupacan/apirest/"+user.imagen;
        this.myForm.controls['nombre'].setValue(user.nombre);
        this.myForm.controls['apellido'].setValue(user.apellido);
        this.myForm.controls['direccion'].setValue(user.direccion);
        this.myForm.controls['password'].setValue(user.password);
        this.myForm.controls['telefono'].setValue(user.telefono);
        this.myForm.controls['email'].setValue(user.email);
        this.myForm.controls['direccion'].setValue(user.direccion);
      }
    })
  }

  addPerfilPhoto(){
    const options = {
      mediaType: this.camera.MediaType.ALLMEDIA,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true,
    };

    this.camera.getPicture(options)
    .then((fileUri) => {
      console.log('fileUri_camara', fileUri);
      // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
      // Only giving an android example as ionic-native camera has built in cropping ability
      if (this.platform.is('ios')) {
        return fileUri
      } else if (this.platform.is('android')) {
        // Modify fileUri format, may not always be necessary
        fileUri = 'file://' + fileUri;

        /* Using cordova-plugin-crop starts here */
        this.cropPicture(fileUri);
      }
    })
  }

  toBase64(filePath) {
    this.base64.encodeFile(filePath).then((base64File: string) => {
      this.base64Image = base64File;
    });
  }

  getTrustImg(){
    console.log('fn_muestra', this.imagePath);
    if(this.imagePath != "assets/imgs/1.jpg"){
      let path = this.win.Ionic.WebView.convertFileSrc(this.imagePath);
      console.log('fn_muestra_path',path);
      return path;
    }else{
      return this.imagePath;
    }
  }

  cropPicture(path){
    console.log('path_crop', path);
    let option={
      quality: 100,
      targetHeight: 100,
      targetWidth: 100
    };

    this.crop.crop(path, option).then(newImageCrop=>{
     this.imagePath = newImageCrop;
     console.log('imagen_cropeanda', newImageCrop);
     this.toBase64(newImageCrop);
    },error=>{
      console.log('error_Crop', error );
    })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }

}
