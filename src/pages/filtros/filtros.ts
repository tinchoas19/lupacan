import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html',
})
export class FiltrosPage {
  localidades: any;
  localidadSelected: any = [];
  selectOptionsLocal = {
    title: 'Localidades',
    subTitle: 'Selecciona las localidades para filtrar!',
    mode: 'md'
  };
  selectOptionsRaza = {
    title: 'Razas',
    subTitle: 'Selecciona las razas para filtrar!',
    mode: 'md'
  };
  filtrosList: any;
  stackFiltrado: any;
  stack: any;
  catId: any;
  razas: any = [];
  razaSelected: any = [];
  estadoDog: any = "";
  selectgeneroDog:any="";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private api: ApiProvider
  ) {
    this.filtrosList = navParams.get('filtrosDe')
    this.stack = navParams.get('stackFilter');
    this.catId = navParams.get('categoriaId');
    /* {filtrosDe: 'service', stackFilter: this.services} */
    this.getLocalidades();
    this.getRazas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltrosPage');
  }

  getRazas() {
    this.api.getBreed().subscribe(data => {
      console.log('raza', data);
      this.razas = data['data']['colores'];
    })
  }

  getLocalidades() {
    this.api.getLocalidades(this.catId).subscribe(cat => {
      console.log('localidades', cat);
      this.localidades = cat['data'];
    })
  }

  getLocal(localidad) {
    console.log('local', localidad);
    this.localidadSelected = [];
    this.localidadSelected.push(localidad);
    console.log('local', this.localidadSelected);
  }

  somethingRaza(selectraza) {
    console.log('selectraza', selectraza);
    this.razaSelected = [];
    this.razaSelected.push(selectraza);
  }

  eliminarLocalidad(index) {
    console.log('index', index);
    console.log('antes', this.localidadSelected[0]);
    this.localidadSelected[0].splice(index, 1);
    console.log('desp-elimino', this.localidadSelected);
  }

  eliminarRaza(index) {
    this.razaSelected[0].splice(index, 1);
  }

  dismiss() {
    this.viewCtrl.dismiss(this.stack);
  }

  aplicarFiltro() {
    let array1 = [];
    this.stackFiltrado = this.stack;
    console.log('localidades_seleccionadas', this.localidadSelected[0]);
    console.log('filtrado', this.stackFiltrado);
    if (this.localidadSelected[0].length > 0) {
      this.stackFiltrado.map(x => {
        this.localidadSelected[0].map(y => {
          if (x.localidad == y.localidad) {
            array1.push(x);
          }
        })
      })
      this.stackFiltrado = array1;
      console.log('aux', this.stackFiltrado);
    }
    this.viewCtrl.dismiss(this.stackFiltrado);
  }

  aplicarFiltroDog() {
    let array1 = [];
    this.stackFiltrado = this.stack;
    if (this.estadoDog != "") {
      switch (this.estadoDog) {
        case 'casa':
          this.stackFiltrado.map(x => {
            if (x.estaenadopcion == 0 && x.estaencontrado == 0 && x.estaperdido == 0) {
              array1.push(x);
            }
          })
          this.stackFiltrado = array1;
          break;
        case 'adopcion':
          this.stackFiltrado.map(x => {
            if (x.estaenadopcion == 1 && x.estaencontrado == 0 && x.estaperdido == 0) {
              array1.push(x);
            }
          })
          this.stackFiltrado = array1;
          break;
        case 'perdido':
          this.stackFiltrado.map(x => {
            if (x.estaenadopcion == 0 && x.estaencontrado == 0 && x.estaperdido == 1) {
              array1.push(x);
            }
          })
          this.stackFiltrado = array1;
          break;
      }
    }

    if(this.razaSelected[0].length > 0){
      this.stackFiltrado.map(x => {
        this.razaSelected[0].map(y => {
          if (x.raza == y.nombre) {
            array1.push(x);
          }
        })
      })
      this.stackFiltrado = array1;
    }

    if(this.selectgeneroDog != ""){
      if(this.selectgeneroDog == "0"){
        this.stackFiltrado.map(x=>{
          if(x.generoid == 0){
            array1.push(x);
          }else{
            array1.push(x);
          }
        })
      }
      this.stackFiltrado = array1;
    }

    this.viewCtrl.dismiss(this.stackFiltrado);
    
  }

}
