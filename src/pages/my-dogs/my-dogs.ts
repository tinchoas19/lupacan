import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DogPage } from '../dog/dog';
import { AddDogPage } from '../add-dog/add-dog';


/**
 * Generated class for the MyDogsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-dogs',
  templateUrl: 'my-dogs.html',
})
export class MyDogsPage {

private myDogs: any[];
private foundDogs: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.myDogs = [
      {
        "dogId": 1,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
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
        "dogId": 1,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
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

      }
    ];

    this.foundDogs = [
      {
        "dogId": 1,
        "dogName": "Caty",
        "isOnline": true,
        "imageUrl": "1.jpg",
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
        "dogId": 1,
        "dogName": "Rufus",
        "isOnline": true,
        "imageUrl": "1.jpg",
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

      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDogsPage');
  }

  goToDogDetail(dog){
    this.navCtrl.push(DogPage, {dogDetail: dog, isMyDogs: true});
  }

  addNewDog(){
    this.navCtrl.push(AddDogPage);
  }
}
