import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-descuentos',
  templateUrl: 'descuentos.html',
})
export class DescuentosPage {

  misDescuentos:any=[];
  categorias:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    public viewCtrl: ViewController
  ) {
    this.categorias = this.navParams.data.categorias;
    console.log('cat', this.categorias);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescuentosPage');
  }

  ionViewWillEnter(){
    this.api.descuentosLocal(this.navParams.data['localid']).subscribe(x=>{
      console.log('descuentosLocal',x);
      this.misDescuentos = x['data'];
      console.log('this.misDescuentos',this.misDescuentos)
    })
  }

  crearDescuentos(){
    console.log('descuentos_creados',this.misDescuentos);
    this.misDescuentos.map(des=>{
      this.api.actualizarDescuentoLocal(this.navParams.data['localid'],des.categoriaid, des.descuento, des.fechavencimiento).subscribe(x=>{
        console.log('actualizarDescuento',x);
      })
      this.viewCtrl.dismiss();
    })
  }

}
