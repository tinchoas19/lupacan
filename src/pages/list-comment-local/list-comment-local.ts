import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-list-comment-local',
  templateUrl: 'list-comment-local.html',
})
export class ListCommentLocalPage {
  comentarios:any;
  seguidores:any;
  title:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    console.log('comments', navParams.get('comments'));
    this.controlParam(this.navParams);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListCommentLocalPage');
  }

  controlParam(params){
    if(params.get('comments')){
      this.title = 'Comentarios';
      this.comentarios = params.get('comments');    
    }
    if(params.get('seguidores')){
      this.title = 'Seguidores';
      this.seguidores = params.get('seguidores');    
    }
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

}
