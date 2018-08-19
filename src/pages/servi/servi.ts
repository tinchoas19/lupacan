import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceListPage } from "../service-list/service-list";

/**
 * Generated class for the ServiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-servi',
  templateUrl: 'servi.html',
})
export class ServiPage {
private categories: any[];
private services: any[];
private filteredServices: any[];
private showCategories: boolean = true;
public inputText: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.services = [
      {
        "serviceId": 1,
        "serviceName": "Vererinaria Patito",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 2,
        "serviceName": "Vererinaria Patito2",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 3,
        "serviceName": "Vererinaria Patito3",
        "categoryId": 1,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 4,
        "serviceName": "Vererinaria Patito4",
        "categoryId": 2,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 5,
        "serviceName": "Vererinaria Patito5",
        "categoryId": 2,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 6,
        "serviceName": "Vererinaria Patito6",
        "categoryId": 3,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 7,
        "serviceName": "Vererinaria Patito7",
        "categoryId": 4,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      },
      {
        "serviceId": 8,
        "serviceName": "Vererinaria Patito 8",
        "categoryId": 4,
        "serviceTelephone": "47745698",
        "serviceAddress": "Lavalle 1514",
        "serviceEmail": "pets@petshot.com",
        "serviceServices": [{ "offeredService": "lavado" },{ "offeredService": "limpieza" },{ "offeredService": "barrido" }]
      }


    ];
    this.categories = [
      {
        "categoryId": 1,
        "categoryName": "Adiestramiento"
      },
      {
        "categoryId": 2,
        "categoryName": "Alimentos y Produccion"
      },
      {
        "categoryId": 3,
        "categoryName": "Atencion Medica"
      },
      {
        "categoryId": 4,
        "categoryName": "Guarderias"
      },
      {
        "categoryId": 5,
        "categoryName": "Paseadores"
      },
      {
        "categoryId": 6,
        "categoryName": "Peluqueria, Belleza y Banio"
      },
      {
        "categoryId": 7,
        "categoryName": "Pet Friendly"
      },
      {
        "categoryId": 8,
        "categoryName": "Pet Shop"
      },
      {
        "categoryId": 9,
        "categoryName": "Refugios"
      }
     
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiPage');
  }
  
  goToCategory(category){
    this.navCtrl.push(ServiceListPage, category);
  }
  
  getItems(ev: any) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;
    this.inputText = val;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.showCategories = false; 
      this.filteredServices = this.services.filter((item) => {
        return (item.serviceName.toLowerCase().indexOf(val.toLowerCase()) > -1 );
      });
    }
    else{
      this.showCategories = true; 
    }
  }
}
