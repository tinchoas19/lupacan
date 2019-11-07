import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-descuentos',
  templateUrl: 'descuentos.html',
})
export class DescuentosPage {

  minDate: string;
  misDescuentos: any = [];
  categorias: any;
  categoriaid:any;
  descuento:any;
  fechavencimiento:any;
  mostrar:boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: ApiProvider,
    public viewCtrl: ViewController
  ) {
    this.categorias = this.navParams.data.categorias;
    console.log('cat', this.categorias);
    this.minDate = new Date().toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescuentosPage');
  }

  ionViewWillEnter() {
    this.api.descuentosLocal(this.navParams.data['localid']).subscribe(x => {
      console.log('descuentosLocal', x);
      this.misDescuentos = x['data'];
      console.log('this.misDescuentos', this.misDescuentos)
    })
  }

  crearDescuentos() {
    console.log('descuentos_creados', this.misDescuentos);
    this.api.actualizarDescuentoLocal(this.navParams.data['localid'], this.categoriaid, this.descuento, this.fechavencimiento).subscribe(x => {
      console.log('actualizarDescuento', x);
    })
    this.viewCtrl.dismiss();
  }

  changeCat(categoriaid){
    console.log('<<aaa<<', categoriaid);
    if(this.misDescuentos.length > 0){
      this.misDescuentos.map(des=>{
        if(des.categoriaid == categoriaid){
          this.mostrar = true;
          this.descuento = des.descuento;
          this.fechavencimiento = des.fechavencimiento;
        }else{
          this.mostrar = true;
          this.descuento = this.fechavencimiento = "";
        } 
      })
    }
  }

  cerrar(){
    //let result = "se cerró";
    this.viewCtrl.dismiss();
  }

}
