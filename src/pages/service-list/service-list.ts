import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceDetailPage } from "../service-detail/service-detail";

/**
 * Generated class for the ServiceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-service-list',
  templateUrl: 'service-list.html',
})
export class ServiceListPage {
  private services: any[];
  private filteredServices: any[];

  private category: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.category = this.navParams.data;
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

    this.filteredServices = this.services.filter(item => item.categoryId == this.category.categoryId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceListPage');
  }
  goToService(service) {
    this.navCtrl.push(ServiceDetailPage, service);
  }
}
