import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'add-fav-user',
  templateUrl: 'add-fav-user.html'
})
export class AddFavUserComponent implements OnInit {

  isChecked: boolean;
  @Input() usuariofav: any
  userid:any;

  constructor(
    private api: ApiProvider,
    private storage: Storage,
    public toastController: ToastController,
  ) {
    console.log('Hello AddFavUserComponent Component');
    this.isChecked = false;
  }

  ngOnInit(): void {
    this.storage.get('datauser').then(x => {
      if (x != null) {
        this.userid = x['usuarioid'];
        this.api.getFavLocal(this.userid, this.usuariofav).subscribe(x => {
          //console.log('x_fav',x);
          if (x['data']) {
            this.isChecked = true;
          } else {
            this.isChecked = false;
          }
        })
      }
    })
  }

  addToFavorites(){
    if (this.isChecked) {
      this.api.addFavoriteLocal(this.userid, this.usuariofav, 0).subscribe(x => {
        console.log('fav', x);
        let data = JSON.parse(x['_body'])['data'];
        if (data) {
          this.errorToast();
        }
      });
      this.isChecked = false;
    } else {
      console.log('remove_Fav => (userid, dogid)');
      this.api.addFavoriteLocal(this.userid, this.usuariofav, 1).subscribe(x => {
        console.log('fav', x);
        let data = JSON.parse(x['_body'])['data'];
        if (data) {
          this.exitoToast();
        }
      });
      this.isChecked = true;
    }
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: "Dejaste de seguir a este Usuario!",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastError',
      closeButtonText: 'x'
    });
    toast.present();
  }

  async exitoToast() {
    const toast = await this.toastController.create({
      message: "Listo!\n Comenzaste a seguir a este Usuario.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
