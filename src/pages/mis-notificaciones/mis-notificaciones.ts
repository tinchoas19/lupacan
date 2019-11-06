import { Badge } from '@ionic-native/badge';
import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-mis-notificaciones',
  templateUrl: 'mis-notificaciones.html',
})
export class MisNotificacionesPage {
  listaFechas: any=[];
  msj: boolean;
  notificaciones:any=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private api: ApiProvider,
    private badge: Badge
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MisNotificacionesPage');
  }

  ionViewWillEnter(){
    this.storage.get('datauser').then(user=>{
      if(user!=null){
        this.api.getNotificacionesUser(user['usuarioid']).subscribe(x=>{
          console.log('not', x);
          this.notificaciones = x['data'];
          this.procesarLista();
          this.badge.clear();
          if(this.notificaciones.length === 0){
            this.msj = true;
          }else{
            this.msj = false;
          }
        })
      }
    })
  }

  procesarLista(){
    this.listaFechas = [];
    let fechaVieja = "";
    let items = {};
    items['listaEventos'] = [];
    this.notificaciones.map(x=>{
      console.log('e', x.fecha);
      console.log('fechaVieja', fechaVieja);      
      if(x.fecha != new Date(fechaVieja)){
        console.log('1');
        
        if(fechaVieja != ""){
          this.listaFechas.push(items);
          items = {};
          items['listaEventos'] = [];
        }
      }
      console.log('2');
      
        fechaVieja = x.fecha;
        items['fecha'] = fechaVieja;
        items['listaEventos'].push(x);
      //console.log('item_vigente',items);
    })
    this.listaFechas.push(items);    
    console.log(this.listaFechas);
  }

  mostrarDia(fecha){
    let date = new Date(fecha).toLocaleDateString();
    //var day = fecha.split("-").reverse();
    return date;
  }

  dia(fecha){
    console.log('fecha', fecha);
    var date = new Date(fecha);
    var dia =  date.getDay()+1 > 31? date.getDay() : date.getDay()+1 ;
    console.log('date', date);
    console.log('dia', dia);
    var day;
    switch (dia) {
      case 0:
          day = "Domingo";
          break;
      case 1:
          day = "Lunes";
          break;
      case 2:
          day = "Martes";
          break;
      case 3:
          day = "Miércoles";
          break;
      case 4:
          day = "Jueves";
          break;
      case 5:
          day = "Viernes";
          break;
      case 6:
          day = "Sábado";
    }
    return day
  }

}
