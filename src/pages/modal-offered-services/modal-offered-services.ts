import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-offered-services',
  templateUrl: 'modal-offered-services.html',
})
export class ModalOfferedServicesPage {
  private character: any;
  servicios:any=[];
  serviciosSelected:any=[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private api: ApiProvider
  ) {
  
  }

  ionViewWillEnter(){
    this.api.getServiciosdeLocal().subscribe(serv=>{
      //console.log('serv', serv);
      this.servicios = serv['data'];
      this.servicios.map(service=>{
        service.checked = false;
      })
      console.log('servicios', this.servicios);
    })
  }

  eliminarServicio(index){
    console.log('index', index);
    console.log('antes', this.serviciosSelected);
    this.serviciosSelected.splice(index, 1);
    console.log('desp-elimino', this.serviciosSelected);
  }

  updateCucumber(serv, index){
    console.log('serv', serv);
    if(!serv.checked){
      console.log('1')
      serv.checked = true;
      this.serviciosSelected.push(serv);
    }else{
      console.log('2')      
      serv.checked = false;
      this.eliminarServicio(index)
    }
    console.log('this.serviciosSelected', this.serviciosSelected);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalOfferedServicesPage');
  }

  dismiss() {
    this.viewCtrl.dismiss(this.serviciosSelected);
  }
}
