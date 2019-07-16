import { HttpClient, HttpParams } from '@angular/common/http';
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
  ) { }

  //--------LOGIN--------
  validarUsuario(usuario, pass) {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/validarusuario.php?usuario=" + usuario + "&password=" + pass)
      .pipe(
        tap(x => {
          console.log('validar usuario', x);
        })
      );
  }

  validarUserFb(id) {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/validarusuario.php?facebookid=" + id)
      .pipe(
        tap(x => {
          console.log('validar fbId', x);
        })
      );
  }
//-------- USUARIO -----------
  getUser(userId): Observable<any>{
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerperfilusuario.php?usuarioid=" + userId)
      .pipe(
        tap(x => {
          console.log('validar usuario', x);
        })
      );
  }

  
  //-------- REGISTRO -----------
  //-POST--------------
  createUser(user, foto, facebookid): Observable<any>{
    console.log('user', user);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      nombre: user.nombre,
      apellido: user.apellido, 
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      password: user.password,
      fechanacimiento: user.edad, 
      imagen: foto,
      facebookid: facebookid ? facebookid : 0
    });
      
    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "crearusuario.php", body, options).pipe(
      tap(x => {
        console.log('createUser', x);
      }));
  }
  
  //-------- UPDATE USER -----------
  //-POST--------------
  updateUser(user,usuarioid, foto): Observable<any>{
    console.log('user', user);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid : usuarioid, 
      nombre: user.nombre,
      apellido: user.apellido, 
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      password: user.password,
      fechanacimiento: user.edad, 
      imagen: foto
    });
      
    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "crearusuario.php", body, options).pipe(
      tap(x => {
        console.log('createUser', x);
      }));
  }
  //-------- RECUPERO_PASS -----------
  //-POST--------------
  recuperoPass(data): Observable<any>{
    console.log('email', data);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      usuario: data.usuario,
    });
      
    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "enviarrecupero.php", body, options).pipe(
      tap(x => {
        console.log('recuperoPASS', x);
      }));
  }

  //-------- ULTIMOS AGREGADOS -----------
  getUltimosAgregados() {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerultimosagregados.php")
      .pipe(
        tap(x => {
          console.log('Ultimos Agregados', x);
        })
      );
  }

  //-------- BUSCAR -------
  buscar(val): Observable<any> {
    return this.httpClient.get('http://ctrlztest.com.ar/lupacan/apirest/busqueda.php?texto='+val);
  }

  //-------- CHAT -------
  getChat() {
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

  sendMsg(msg: ChatMessage) {
    return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
      .then(() => this.mockNewMsg(msg));
  }

  //---------------------

  //-------- SERVICIO -----------
  
  getServiciosdeLocal(): Observable<any>{
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerserviciosdelocal.php")
      .pipe(
        tap(x => {
          console.log('traerserviciosdelocal', x);
        })
      );
  }
  getCategories(): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traercategoriaslocal.php"
    );
  }

  getLocales(): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerlocales.php"
    );
  }

  getComments(localid): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traercomentariosporlocal.php?localid="+localid
    );
  }

  //-------- SERVICIO -----------

  getMisLocales(userid): Observable<any> {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerlocalesporusuario.php?usuarioid="+userid)
    .pipe(
      tap(x => {
        console.log('traerlocalesporusuario', x);
      })
    );
  }
  //----------------POST--------------
  createService(tienda,servicios,foto): Observable<any> {
    console.log('t', tienda);
    console.log('ser', servicios);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      nombre: tienda.nombre, 
      direccion: tienda.direcc, 
      telefono: tienda.telefono,
      horarioapertura: tienda.horaA,
      horariocierre: tienda.horaC, 
      categoria: tienda.category, 
      imagenes: foto,
      usuarioid: tienda.usuarioid, 
      placeid: tienda.placeid,
      servicios: servicios, 
    });
      
    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "crearservicio.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAPiCreateServ', x);
      }));
  }

  //-------- EDITAR SERVICIO -----------
  //----------------POST--------------
  updateService(localid,tienda,servicios,foto): Observable<any> {
    console.log('t', tienda);
    console.log('ser', servicios);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      localid: localid,
      nombre: tienda.nombre, 
      direccion: tienda.direcc, 
      telefono: tienda.telefono,
      horarioapertura: tienda.horaA,
      horariocierre: tienda.horaC, 
      categoria: tienda.category, 
      imagenes: foto,
      usuarioid: tienda.usuarioid, 
      servicios: servicios, 
    });
      
    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "crearservicio.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAPiCreateServ', x);
      }));
  }
  getStores(categoriaId): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerlocalesporcategoria.php?categoriaid=" + categoriaId
    );
  }

  getDogs(): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerperros.php?usuarioid=" + this.usuarioId
    );
  }

  getMyDogs(id): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traermisperros.php?usuarioid=" + id
    );
  }

  getBreed(): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerrazaycolor.php"
    );
  }

  //----------------POST--------------

   createDog(dog, fotos): Observable<any> {
    console.log('dog', dog);
    console.log('fot', fotos);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      nombre: dog.nombre, 
      descripcion: dog.descripcion, 
      generoid: dog.gender,
      estado: dog.estado,
      direccion: dog.direccion,
      fechanacimiento: dog.nacimiento, 
      razaid: dog.raza, 
      colorid: dog.color, 
      usuarioid: dog.usuarioid,
      placeid: dog.placeid, 
      fotos: fotos 
    });
      
    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "agregarperro.php", body, options).pipe(
      tap(x => {
        console.log('createDog', x);
      }));
  }


}
