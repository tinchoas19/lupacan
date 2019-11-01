import { ChatPage } from './../chat/chat';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-list-chats',
  templateUrl: 'list-chats.html',
})
export class ListChatsPage {

  msj: boolean;
  list_chats:any;
  userid:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private storage: Storage,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListChatsPage');
  }

  ionViewWillEnter(){
    this.misChats();
  }

  misChats(){
    this.storage.get('datauser').then(val=>{
      if(val!=null){
        this.userid = val['usuarioid'];
        this.api.getMisChats(val['usuarioid']).subscribe(x=>{
          console.log('mis_chats',x);
          this.list_chats = x['data'];
          if(x['data']){
            this.list_chats.map(chat=>{
              if (chat.facebookid != '0') {
                chat.imgSrc = "https://graph.facebook.com/" + chat.facebookid + "/picture?type=large";
              } else if (chat.imagen != "") {
                chat.imgSrc = "https://ctrlztest.com.ar/lupacan/apirest/" + chat.imagen
              } else {
                chat.imgSrc = 'assets/imgs/1.jpg';
              }
            })
            this.msj = true;
          }else{
            this.msj = false;
          }
        })
      }
    })
  }

  goToChat(chat){
    let destinoid = "";
    let tipodestino = "";
    if(chat['localid'] != null){
      destinoid = chat['localid'];
      tipodestino = 'tienda';
    }else{
      destinoid = chat['usuarioid2'];
      tipodestino = 'usuario';
    }
    this.navCtrl.push(ChatPage,{userChat: chat, origenid:chat['usuarioid1'], tipoorigen: 'usuario', destinoid: destinoid, tipodestino: tipodestino, conversandocon: chat['conversandocon']});    
  }

}
