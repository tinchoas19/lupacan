import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'add-fav-dog',
  templateUrl: 'add-fav-dog.html'
})
export class AddFavDogComponent implements OnInit {

  @Input() perroid:any;
  isChecked: boolean;
  userid:any;
  constructor(
    private api: ApiProvider,
    private storage: Storage,
    public toastController: ToastController,
  ) {
    console.log('Hello AddFavDogComponent Component');
    //this.text = 'Hello World';
  }

  ngOnInit(): void {
    this.storage.get('datauser').then(x=>{
      if(x!=null){
        this.userid =x['usuarioid'];
        this.api.getFavLocal(this.userid, this.perroid).subscribe(x => {
          console.log('x_fav_dog',x);
          if (x['data']) {
            this.isChecked = true;
          } else {
            this.isChecked = false;
          }
        })
      }
    })
  }

  //add Favorites
  addToFavorites(){
    console.log('add_Fav => (userid, dogid)',this.userid, this.perroid);
    if(this.isChecked){
      this.api.favorite(this.userid, this.perroid, 0).subscribe(x=>{
        console.log('fav',x);
        let data = JSON.parse(x['_body'])['data'];
        if(data){
          this.presentToasteError();
        }
      });
      this.isChecked = false;
    }else{
    console.log('remove_Fav => (userid, dogid)');      
    this.api.favorite(this.userid, this.perroid, 1).subscribe(x=>{
      console.log('fav',x);
      let data = JSON.parse(x['_body'])['data'];
      if(data){
        this.presentToasteEx();
      }
    });
      this.isChecked = true;
    }
  }

  async presentToasteError() {
    const toast = await this.toastController.create({
      message: "Lo eliminaste de tus favoritos :(",
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
      message: "Listo!\n Se agrego a tus favoritos.",
      duration:2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
