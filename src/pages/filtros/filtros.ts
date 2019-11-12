import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html',
})
export class FiltrosPage {
  localidades: any = null;
  descuentos: any = null;
  localidadSelected: any = [];
  descuentoSelected: any = [];
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
  generoSelected: any;
  estadoDog: any = "";
  selectgeneroDog: any = "";
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

  ionViewWillEnter(){
   
  }

  onSelectedDecuento(event){
    console.log("estado seleccionado", event);
    this.descuentoSelected = event;
  }

  getRazas() {
    this.api.getBreed().subscribe(data => {
      console.log('raza', data);
      this.razas = data['data']['colores'];
    })
  }

  getLocalidades() {
    this.api.traerFiltrosLocales(this.catId).subscribe(x => {
      console.log('localidades', x);
      this.localidades = x['data']['localidades'];
      this.descuentos = x['data']['descuentos'];
    })
  }

  onLocalSelected(event) {
    console.log('local', event);
    this.localidadSelected = event;
  }

  somethingRaza(selectraza) {
    console.log('selectraza', selectraza);
    this.razaSelected = selectraza;
    // this.razaSelected.push(selectraza);
  }

  somethingGenero(selectgenero) {
    console.log('select genero', selectgenero);
    this.selectgeneroDog = selectgenero;
    // this.razaSelected.push(selectraza);
  }

  eliminarLocalidad(index) {
    console.log('index', index);
    console.log('antes', this.localidadSelected[0]);
    this.localidadSelected[0].splice(index, 1);
    console.log('desp-elimino', this.localidadSelected);
  }

  onSelectEstado(event) {
    console.log("estado seleccionado", event);
    this.estadoDog = event;
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
    console.log('localidades_seleccionadas', this.localidadSelected);
    console.log('filtrado', this.stackFiltrado);
    if (this.localidadSelected.length > 0) {
      this.stackFiltrado.map(x => {
        this.localidadSelected.map(y => {
          if (x.localidad == y) {
            array1.push(x);
          }
        })
      })
      this.stackFiltrado = array1;
      console.log('aux', this.stackFiltrado);
    }
    if (this.descuentoSelected.length > 0) {
      this.stackFiltrado.map(x => {
        this.descuentoSelected.map(y => {
          if (x.descuento == y) {
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
      array1 = this.stackFiltrado.filter(f => {
        return (f.estado == this.estadoDog);
      });
      this.stackFiltrado = array1;
    }

    if (this.razaSelected.length > 0) {
      this.stackFiltrado.map(x => {
        this.razaSelected.map(y => {
          if (x.raza == y.nombre) {
            array1.push(x);
          }
        })
      })
      this.stackFiltrado = array1;
    }

    if (this.selectgeneroDog != "") {
      
        array1 = this.stackFiltrado.filter(x => {
          return (x.generoid == this.generoSelected);
            
        })
      
      this.stackFiltrado = array1;
    }

    this.viewCtrl.dismiss(this.stackFiltrado);

  }

}
