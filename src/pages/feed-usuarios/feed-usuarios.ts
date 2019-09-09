import { ListDogUserPage } from './../list-dog-user/list-dog-user';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-feed-usuarios',
  templateUrl: 'feed-usuarios.html',
})
export class FeedUsuariosPage {

  ultimosAgregados:any = [];
  todosUsers:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
  ) {
  }

  ionViewWillEnter(){
    this.getAllUsers();
    this.getUltimosAgregados();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedUsuariosPage');
  }

  getUltimosAgregados(){
    this.api.getUltimosAgregadosUsuarios().subscribe(x=>{
      this.ultimosAgregados = x['data'];
      //console.log('ultimos_agre',this.ultimosAgregados[3].imagen);
    })
  }

  getAllUsers(){
    this.api.getAllUsers().subscribe(x=>{
      console.log('todos',x);
      this.todosUsers = x['data'];
    })
  }

  goToUserDetail(user){
    this.navCtrl.push(ListDogUserPage,{id : user.usuarioid})
  }

}
