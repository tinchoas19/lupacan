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
  dataTienda:any=[];
  dataDog:any=[];
  imgDog:any;
  msgList: ChatMessage[] = [];
  user:any;
  toUser:any;
  nombreChat:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private services: ApiProvider,
  ) {
  }

  ionViewWillEnter(){
    this.imgDog = this.navParams.data.dog['fotos'][0].fotourl;
    this.dataDog = this.navParams.data.dog;
      this.user = {
        id: 1,
        name: 'Rodri'
      }
      console.log(this.navParams.data.chatid)
      let loading = this.loadingCtrl.create({
        content: 'Espere por favor...'
      });
      loading.present();
      this.services.getChat().subscribe(x=>{
        console.log('dataChat',x);
        if(x['data']){
          x['data'].map((msj)=>{
            let newMsg : ChatMessage = {
              messageId : msj.chatmensajeid,
              userId : msj.origenusuarioid,
              userName: this.user.name,
              time : msj.fechayhora,
              message : msj.mensaje,
              status : 'success',
              destinoId : this.user.id,
            };
            this.toUser = msj.origenusuarioid;
            this.pushNewMsg(newMsg);
          })
          loading.dismiss();
        }else{
          loading.dismiss();          
        }
      })
    /* if(this.navParams.data.tienda && this.navParams.data.producto){
      this.dataTienda = this.navParams.data.tienda[0];
      this.nombreChat = this.dataTienda.nombre;
      this.dataProd = this.navParams.data.producto;
      this.toUser = this.dataProd.usuarioid == null ? this.dataProd.tiendaid : this.dataProd.usuarioid;
      this.user = {
        id: this.services._usuario.usuarioid,
        name: this.services._usuario.nombre
      }
    } */
    console.log('dataUser', this.services._usuario);
    console.log(this.navParams.data);
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

  sendMsg() {
    if (!this.editorMsg.trim()) return;

    const id = Date.now().toString();
    
    let newMsg : ChatMessage = {
      messageId : Date.now().toString(),
      userId : this.user.id,
      userName: this.user.name,
      time : Date.now(),
      message : this.editorMsg,
      status : 'pending',
      destinoId : this.toUser,
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    if(!this.showEmojiPicker){
      this.focus();
    }

    this.services.sendMsg(newMsg).then(()=>{
      let index = this.getMsgIndexById(id);
      if(index !== -1){
        this.msgList[index].status = 'success';
      }
    })
  }

  pushNewMsg(msg: ChatMessage) {
    const userId = this.user.id,
      toUserId = this.toUser;
    // Verify user relationships
    if (msg.userId === userId && msg.destinoId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.destinoId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  private focus(){
    if(this.messageInput && this.messageInput.nativeElement){
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll(){
    const textarea = this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }

}
