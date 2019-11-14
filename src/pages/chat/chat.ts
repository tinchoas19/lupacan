import { Storage } from '@ionic/storage';
import { ApiProvider, usuario, ChatMessage } from './../../providers/api/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events, Content, LoadingController, Navbar } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  imageChatCon: any;
  imagenUser: any;
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  @ViewChild(Navbar) navBar: Navbar;
  showEmojiPicker = false;
  editorMsg = '';
  dataTienda: any = [];
  dataDog: any = null;
  dataUser: any = null;
  imgDog: any;
  imgUser: any;
  msgList: ChatMessage[] = [];
  user: any;
  toUser: any;
  nombreChat: string;
  destinoTipo: string;
  origentipo: string;
  origenid: any;
  destinoid: any;
  nombreUser: string;
  idUser: any;
  buscarChats: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private services: ApiProvider,
    private storage: Storage
  ) {
    //this.dataUserLogueado();
    //this.mostrarimgChatCon(this.navParams.data)
    this.cargarImg(this.navParams.data.destinoid);
  }

  cargarImg(idUser){
    if(this.navParams.data.userChat){
      this.navParams.data.userChat.imgSrc
    }else{
      if(this.navParams.data.tipodestino == 'usuario'){
        this.services.getUser(idUser).subscribe(data=>{
          console.log('dataUser',data);
          let info = data['data'];
          if (info.facebookid != '0' && info.imagen == "") {
            this.imageChatCon = "https://graph.facebook.com/" + info.facebookid + "/picture?type=large";
          } else if (info.imagen != "") {
            this.imageChatCon = "https://ctrlztest.com.ar/lupacan/apirest/" + info.imagen
          } else {
            this.imageChatCon = 'assets/imgs/1.jpg';
          }
        })
      }else{
        this.services.getLocalData(idUser).subscribe(data=>{
          console.log('dataTienda',data);
          this.imageChatCon = "https://ctrlztest.com.ar/lupacan/apirest/"+data['data']['imagenes'][0].imagen;
        })
      }
    }
  }

  misDatos() {
    this.storage.get('datauser').then(val => {
      if (val != null) {
        console.log('vaaal', val);
        this.nombreUser = val['nombre'];
        this.idUser = val['usuarioid']
        if (val.facebookid != '0') {
          this.imagenUser = "https://graph.facebook.com/" + val.facebookid + "/picture?type=large";
        } else if (val.imagen != "") {
          this.imagenUser = "https://ctrlztest.com.ar/lupacan/apirest/" + val.imagen
        } else {
          this.imagenUser = 'assets/imgs/1.jpg';
        }
      }
    })
  }

  interval() {
    this.buscarChats = setInterval(() => {
      this.traerNoLeidos(this.navParams.data);
    }, 2000)
  }

  traerNoLeidos(params) {
    this.services.getChatNoLeidos(params.origenid, params.origentipo, params.destinoid, params.destinotipo).subscribe(x => {
      console.log('ChatNoLeidos', x);
      if (x['data'] != null) {
        x['data'].map(message => {
          let chatCon = "";
          let origen = "";
          if (message.origenlocalid != null) {
            origen = message.origenlocalid;
          } else {
            origen = message.origenusuarioid;
          }
          let destino = "";
          if (origen == params.origenid) {
            chatCon = this.nombreUser;
            destino = params.destinoid;
          } else {
            chatCon = params.conversandocon;
            destino = params.origenid;
          }
          let newMsg: ChatMessage = {
            messageId: message.chatmensajeid,
            userId: origen,
            userName: chatCon,
            time: message.fechayhora,
            message: message.mensaje,
            status: 'success',
            destinoId: destino,
          };

          this.pushNewMsg(newMsg);
        })
      }
    })
  }

  traerChats(params) {
    this.misDatos();
    console.log('params', params);
    this.services.getChat(params.origenid, params.origentipo, params.destinoid, params.destinotipo).subscribe(x => {
      console.log('dataChat', x);
      if (x['data']) {
        x['data'].map(message => {
          let chatCon = "";
          let origen = "";
          if (message.origenlocalid != null) {
            origen = message.origenlocalid;
          } else {
            origen = message.origenusuarioid;
          }
          let destino = "";
          if (origen == params.origenid) {
            chatCon = this.nombreUser;
            destino = params.destinoid;
          } else {
            chatCon = params.conversandocon;
            destino = params.origenid;
          }
          let newMsg: ChatMessage = {
            messageId: message.chatmensajeid,
            userId: origen,
            userName: chatCon,
            time: message.fechayhora,
            message: message.mensaje,
            status: 'success',
            destinoId: destino,
          };

          this.pushNewMsg(newMsg);
        })
      }
    })
  }


  ionViewWillEnter() {
    //this.controlParams(this.navParams.data);
    this.traerChats(this.navParams.data);
    this.interval();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  doYourStuff() {
    clearInterval(this.buscarChats);
    this.navCtrl.pop();  // remember to put this to add the back button behavior
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  sendMsg(msg) {
    if (!this.editorMsg.trim()) return;
    console.log('send_nsj', this.toUser);

    const id = Date.now().toString();

    let newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.idUser,
      userName: this.nombreUser,
      time: Date.now(),
      message: this.editorMsg,
      status: 'pending',
      destinoId: this.navParams.data.destinoid,
    };

    //this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if (!this.showEmojiPicker) {
      this.focus();
    }

    this.services.sendMsg(newMsg, this.navParams.data.destinoTipo, this.navParams.data.origentipo).subscribe((x) => {
      console.log('xxx', x);
      let index = this.getMsgIndexById(id);
      if (index !== -1) {
        this.msgList[index].status = 'success';
      }
    })
  }

  pushNewMsg(msg: ChatMessage) {
    console.log('msg_push', msg);
    //const userId = this.user.id,
    //toUserId = this.toUser;
    // Verify user relationships
    this.msgList.push(msg);
    /* if (msg.userId == userId && msg.destinoId == toUserId) {
    } else if (msg.destinoId == userId && msg.userId == toUserId) {
      this.msgList.push(msg);
    } */
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

}
