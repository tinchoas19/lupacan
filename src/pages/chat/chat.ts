import { Storage } from '@ionic/storage';
import { ApiProvider, usuario, ChatMessage } from './../../providers/api/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events, Content, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
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
  nombreUser:string;
  idUser:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private services: ApiProvider,
    private storage: Storage
  ) {
    //this.dataUserLogueado();
  }

  misDatos(){
    this.storage.get('datauser').then(val=>{
      if(val!=null){
        this.nombreUser = val['nombre'];
        this.idUser = val['usuarioid']
      }
    })
  }

  traerChats(params) {
    this.misDatos();
    console.log('params', params);
    this.services.getChat(params.origenid, params.origentipo, params.destinoid, params.destinotipo).subscribe(x => {
      console.log('dataChat', x);
      if(x['data']){
        x['data'].map(message=>{
          let chatCon = "";
          let origen = "";
          if(message.origenlocalid != null){
            origen = message.origenlocalid;
          }else{
            origen = message.origenusuarioid;
          } 
          let destino = "";
          if(origen == params.origenid){
            chatCon = this.nombreUser;
            destino = params.destinoid;
          }else{
            chatCon =params.conversandocon;
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

  /* controlParams(params) {
    if (params.dog && params.chatde) {
      this.imgDog = this.navParams.data.dog['fotos'][0].fotourl;
      this.dataDog = this.navParams.data.dog;
      if (params.chatde == 'usuario') {
        console.log('1');
        this.destinoTipo = 'usuario';
        this.origentipo = 'usuario';
        this.origenid = params.origenid;
        this.user = {
          id: params.chatid['usuarioid2'] ? params.chatid['usuarioid2'] : params.chatid['localid'],
          name: params.chatid['conversandocon']
        }
        this.destinoid = this.user.id;
        console.log(this.user);
        
      } else {
        console.log('2');
        this.destinoTipo = 'usuario';
        this.origentipo = 'usuario';
        this.origenid = params.origenid;        
        this.user = {
          id: params.chatid['usuarioid1'],
          name: params.chatid['conversandocon']
        }
        this.destinoid = this.user.id;
    }
    if (params.chatid && params.chatde) {
      console.log('chatid', params.chatid);
      this.nombreChat = params.chatid['conversandocon'];

      if (params.chatde == 'usuario') {
        console.log('1');
        this.destinoTipo = params.chatid['usuarioid2'] ? 'usuario' : 'tienda';
        this.origentipo = 'usuario';
        this.origenid = params.origenid;
        this.user = {
          id: params.chatid['usuarioid2'] ? params.chatid['usuarioid2'] : params.chatid['localid'],
          name: params.chatid['conversandocon']
        }
        this.destinoid = this.user.id;
        console.log(this.user);
        
      } else {
        console.log('2');
        this.destinoTipo = 'usuario';
        this.origentipo = 'usuario';
        this.origenid = params.origenid;        
        this.user = {
          id: params.chatid['usuarioid1'],
          name: params.chatid['conversandocon']
        }
        this.destinoid = this.user.id;        
        console.log(this.user);
        
      }
    }
      this.cargarMensajes(params.chatid['chatid']);
      console.log('sad', this.user);
    }
  }

  cargarMensajes(chatid) {
    let loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();
    this.services.getChat(chatid).subscribe(msj => {
      console.log('msj', msj);
      msj['data'].map(message => {
        console.log("origenusuario", message.origenusuarioid);
        console.log("origentienda", message.origenlocalid);
        let origen = "";
        if (message.origenusuarioid != null)
          origen = message.origenusuarioid;
        if (message.origenlocalid != null)
          origen = message.origenlocalid;

        let destino = "";
        if (message.origenusuarioid == null)
          destino = message.origenlocalid;
        if (message.origenlocalid == null)
          destino = message.origenusuarioid;

        let newMsg: ChatMessage = {
          messageId: message.chatmensajeid,
          userId: origen,
          userName: this.user.name,
          time: message.fechayhora,
          message: message.mensaje,
          status: 'success',
          destinoId: destino,
        };
        //console.log('new_msj', newMsg);
        let restultadoDestino = "";
        if (this.navParams.data.chatde  == "tienda")
          restultadoDestino = (this.user.id == message.origenusuarioid ? message.origenlocalid : message.origenusuarioid);
        else
          restultadoDestino = (this.user.id == message.origenusuarioid ? message.origenlocalid : (message.origenusuarioid == null ? message.origenlocalid : msj.origenusuarioid));
        this.toUser = (restultadoDestino != null ? restultadoDestino : this.toUser);
        console.log("destino usuario", this.toUser);
        this.pushNewMsg(newMsg);
      })
      loading.dismiss();
      console.log('sad', this.msgList);
    })
  }
 
  */
  ionViewWillEnter() {
    //this.controlParams(this.navParams.data);
    this.traerChats(this.navParams.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
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

    this.pushNewMsg(newMsg);
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
