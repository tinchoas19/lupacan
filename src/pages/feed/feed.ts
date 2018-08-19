import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DogPage } from "../dog/dog";

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  private dogs: any[];
  private filteredDogs: any[];
  public pageData: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pageData = this.navParams.data;
    this.dogs = [
      {
        "dogId": 1,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": false,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"

      },
      {
        "dogId": 2,
        "dogName": "Willy",
        "isOnline": false,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": false,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 3,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": false,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 4,
        "dogName": "Willy",
        "isOnline": false,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": false,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 5,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": false,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 6,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": false,
        "adopcion": true,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 7,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": false,
        "adopcion": true,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 8,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": false,
        "encontrado": true,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 9,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
        "perdido": true,
        "encontrado": false,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      },
      {
        "dogId": 10,
        "dogName": "Willy",
        "isOnline": false,
        "imageUrl": "1.jpg",
        "imageCollection": ["1.jpg","1.jpg","1.jpg"],
        "perdido": true,
        "encontrado": false,
        "adopcion": false,
        "age": 1,
        "breed":"Jack Russel",
        "color":"Marron y blanco",
        "gender": "Macho",
        "vive": "Azcuenaga y Callao",
        "personalidad": "es saltarin y divertido",
        "fechaPerdido": "19/09/2005",
        "lugarPerdido": "Plaza italia",
        "caracterizticaPerdido": "llevaba un collar rojo y una ropita azul",
        "fechaEncontrado": "19/10/2010",
        "lugarEncontrado": "Callao y Corrientes"
      }
    ];
    console.log("page: ", this.pageData.id);
    switch (this.pageData.id) {
      case 2:
        this.filteredDogs = this.dogs.filter(item => item.perdido == true);
        break;
      case 3:
        this.filteredDogs = this.dogs.filter(item => item.encontrado == true);
        break;
      case 4:
        this.filteredDogs = this.dogs.filter(item => item.adopcion == true);
        break;
      default:
        this.filteredDogs = this.dogs;
        break;
    }
    console.log("perros: ", this.filteredDogs);
  }

  goToDogDetail(dog){
    this.navCtrl.push(DogPage,{dogDetail: dog, isMyDogs: false, pageId: this.pageData.id});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
  }

}
