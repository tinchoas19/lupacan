import { PhotoSliderPage } from './../photo-slider/photo-slider';
import { ListDogUserPage } from './../list-dog-user/list-dog-user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-buscar',
  templateUrl: 'buscar.html',
})
export class BuscarPage {
  items: any;
  mostarUsuarios:boolean = false;
  mostrarPerros:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuscarPage');
  }

  getItems(ev: any) {
    let val = ev.target.value;
    console.log("val", val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '' && val.length > 1) {
      this.api.buscar(val).subscribe(x=>{
        console.log('VUELTA_API_BUSCAR', x);
        this.items = x['data'];
        console.log('item_usuarios', this.items['usuarios']);        
        if(this.items['usuarios'].length > 0 ){
          console.log('1');
          this.mostarUsuarios = true;
        }
        console.log('item_perro', this.items['perros']);                
        if(this.items['perros'].length > 0 ){
          console.log('2');
          this.mostrarPerros = true;
        }
      })
    }else{
      this.items = [];
      this.mostarUsuarios = this.mostrarPerros = false;
    }/*
      //console.log("bus", val);
      if (this.parametro == 1) {
        this.serviceProvider.buscarProductosAuto(val).subscribe(res => {
          //console.log(res);
          this.items = JSON.parse(res);
        });
      }
      else {
        this.serviceProvider.buscarEmpleosAuto(val).subscribe(res => {
          //console.log(res);
          this.items = JSON.parse(res);
        });
      }
    }
    else {
      this.items = [];
    } */
  }

  goToPerfilUser(item){
  this.navCtrl.push(ListDogUserPage, {
      user:item
    })
  }

  goToPerfilDog(item){
    let dog;
    this.api.getDogData(item['perroid']).subscribe(x=>{
      dog = x['data'][0];
      console.log('dog_buscar', dog);
      setTimeout(()=>{
        this.navCtrl.push(PhotoSliderPage, {
          dogDetail: dog
        })
      },700)
    })
  }

}
