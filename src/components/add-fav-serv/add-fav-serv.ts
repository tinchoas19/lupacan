import { ApiProvider } from './../../providers/api/api';
import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'add-fav-serv',
  templateUrl: 'add-fav-serv.html'
})

export class AddFavServComponent implements OnInit {

  @Input() usuarioid: any;
  @Input() localid: any;
  isChecked: boolean;
  constructor(
    private api: ApiProvider,
    public toastController: ToastController,
  ) {
    console.log('Hello AddFavServComponent Component');
    this.isChecked = false;
  }

  ngOnInit(): void {
    this.api.getFavLocal(this.usuarioid, this.localid).subscribe(x => {
      //console.log('x_fav',x);
      if (x['data']) {
        this.isChecked = true;
      } else {
        this.isChecked = false;
      }
    })
  }

  addToFavorites() {
    if (this.isChecked) {
      this.api.addFavoriteLocal(this.usuarioid, this.localid, 0).subscribe(x => {
        console.log('fav', x);
        let data = JSON.parse(x['_body'])['data'];
        if (data) {
          this.errorToast();
        }
      });
      this.isChecked = false;
    } else {
      console.log('remove_Fav => (userid, dogid)');
      this.api.addFavoriteLocal(this.usuarioid, this.localid, 1).subscribe(x => {
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
      message: "Dejaste de seguir a este Comercio!",
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
      message: "Listo!\n Comenzaste a seguir a este comercio.",
      duration: 2000,
      showCloseButton: true,
      position: 'top',
      cssClass: 'toastExito',
      closeButtonText: 'x'
    });
    toast.present();
  }

}
