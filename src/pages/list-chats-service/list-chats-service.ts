import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';

@Component({
  selector: 'page-list-chats-service',
  templateUrl: 'list-chats-service.html',
})
export class ListChatsServicePage {

  localid:any;
  list_chats:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
  ) {
    console.log('data', this.navParams.data['localid']);
    this.localid = this.navParams.data['localid'];
    //this.navParams.data.localid = this.localid;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListChatsServicePage');
  }

  ionViewWillEnter(){
    this.chatsLocal();  
  }

  chatsLocal(){
    this.api.getMisChatsService(this.localid).subscribe(x=>{
      console.log('chats_local',x);
      this.list_chats = x['data'];
    })
  }

  goToChat(chat){
    this.navCtrl.push(ChatPage,{origenid:chat['localid'], tipoorigen: 'tienda', destinoid: chat['usuarioid1'], tipodestino: 'usuario', conversandocon: chat['conversandocon']});    
  }

}
