import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { Events } from 'ionic-angular';

export class ChatMessage {
  messageId: string;
  userId: string;
  userName: string;
  time: number | string;
  message: string;
  status: string;
  destinoId: string;
}
export class evento {
  eventoid: number;
  titulo: string;
  detalle: string;
  imgpath: string;
}
export class usuario {
  usuarioid: number;
  nombre: string;
  apellido: string;
  localidad: string;
  localidadid: number;
  fechanacimiento: Date;
}

@Injectable()
export class ApiProvider {

  ApiUrl = "http://ctrlztest.com.ar/lupacan/apirest/";
  data: Observable<any>;
  usuarioId: number = 1;
  localId: number = 1;
  categoriaId: number = 1;
  _usuario = new usuario();

  constructor(
    private httpPost: Http,
    private httpClient: HttpClient,
    private events: Events
  ) {}

  //-------- CHAT -------
  getChat(){
    return this.httpClient.get("http://ctrlztest.com.ar/ranto/apirest/traermensajeschat.php?chatid=8")
      .pipe(
        tap(x => {
          console.log('chat', x);
        })
      );
  }

  mockNewMsg(msg) {
    const mockMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: '210000198410281948',
      userName: 'Hancock',
      destinoId: '140000198202211138',
      time: Date.now(),
      message: msg.message,
      status: 'success'
    };

    setTimeout(() => {
      this.events.publish('chat:received', mockMsg, Date.now())
    }, Math.random() * 1800)
  }

  sendMsg(msg: ChatMessage){
    return new Promise(resolve => setTimeout(()=> resolve(msg), Math.random() * 1000))
      .then(()=> this.mockNewMsg(msg));
  }

  //---------------------

  getCategories():Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traercategoriaslocal.php"
    );
  }

  getComments():Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traercomentariosporlocal.php" + this.localId
    );
  }

  getStores():Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerlocalesporcategoria.php" + this.categoriaId
    );
  }

  getDogs():Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerperros.php?usuarioid=" + this.usuarioId
    );
  }

  getMyDogs(id):Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traermisperros.php?usuarioid=" + id
    );
  }

  getBreed():Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerrazaycolor.php"
    );
  }

  getRecent() {
    return this.httpClient.get(
      this.ApiUrl + "traerultimosagregados.php"
    );
  }

}
