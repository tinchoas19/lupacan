import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
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
    private storage: Storage,
    private events: Events
  ) { }

  //--------LOGIN--------
  validarUsuario(firebaseUser,usuario, pass) {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/validarusuario.php?usuario=" + usuario + "&password=" + pass +"&firebaseusuarioid="+firebaseUser)
      .pipe(
        tap(x => {
          console.log('validar usuario', x);
        })
      );
  }

  validateUsername(username){
    console.log('username_validaremailexiste', username);
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/validaremailexiste.php?email=" + username)
    .pipe(
      tap(x => {
        console.log('validaremailexiste', x);
      })
    );
  }

  validarUserFb(id,firebaseusuarioid,userName,userEmail) {
    console.log('yendo a valida fb', id);
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/validarusuariofb.php?facebookid=" + id+"&firebaseusuarioid="+firebaseusuarioid+"&nombre="+userName+"&email="+userEmail)
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

  //------------------- NOTIFICACIONES USUARIO ----------------
  getNotificacionesUser(userId): Observable<any>{
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traernotificaciones.php?usuarioid=" + userId)
      .pipe(
        tap(x => {
          console.log('notificaciones usuario', x);
        })
      );
  }

  getNotificacionesSinLeer(userId): Observable<any>{
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traernotificacionessinleer.php?usuarioid=" + userId)
      .pipe(
        tap(x => {
          console.log('notificaciones usuario', x);
        })
      );
  }

  //-------------------USUARIO UPDATE UBICACION----------------
  actualizarPositionUser(userid,lat,lng){
    console.log('user', userid,lat,lng);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      usuarioid: userid,
      latitud: lat,
      longitud: lng,
    });
      
    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "actualizarubicacion.php", body, options).pipe(
      tap(x => {
        console.log('perroPerdido', x);
      }));
  }

  //POST--------------------
  marcarDogPerdido(userid,perroid,lat,lng,placeid){
    console.log('perroPerdido', userid,perroid,lat,lng);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      usuarioid: userid,
      perroid: perroid, 
      latitud: new String(lat),
      longitud: new String(lng),
      placeid:placeid,
    });
      
    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "marcarcomoperdido.php", body, options).pipe(
      tap(x => {
        console.log('perroPerdido', x);
      }));
  }

  marcarDogEncontrado(userid,perroid){
    console.log('perroPerdido', userid,perroid);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      usuarioid: userid,
      perroid: perroid, 
    });
      
    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "marcarcomoencontrado.php", body, options).pipe(
      tap(x => {
        console.log('perroEncontrado', x);
      }));
  }


  //------PUSH NOTIFICATION---------------
  probarPush(userId){
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/probarpush.php?id=" + userId)
      .pipe(
        tap(x => {
          console.log('Probar push', x);
        })
      );
  }
  
  //-------- REGISTRO -----------
  //-POST--------------
  createUser(user, foto, facebookid, firebaseusuarioid): Observable<any>{
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
      firebaseusuarioid:firebaseusuarioid,
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

  getLocales(userid): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerlocales.php?usuarioid="+userid
    );
  }

  //-------- SERVICIO -----------
  //-------- PEMIUM -----------
  localPremium(localid): Observable<any> {
    console.log('localid', localid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      localid: localid,
    });
      
    console.log('body_marcarlocalPremium', body);

    return this.httpPost.post(this.ApiUrl + "marcarlocalpremium.php", body, options).pipe(
      tap(x => {
        console.log('vuelta_LocalPremium', x);
      }));
  }
  //-------- BANNERS -----------
  getPublicidad(tipo): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerpublicidad.php?tipo="+tipo
    );
  }

  publicidadLeida(publicidadid,usuarioid): Observable<any> {
    console.log('t', publicidadid);
    console.log('ser', usuarioid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      publicidadid: publicidadid,
      usuarioid: usuarioid, 
    });
      
    console.log('body_marcarpublicidadleida', body);

    return this.httpPost.post(this.ApiUrl + "marcarpublicidadleida.php", body, options).pipe(
      tap(x => {
        console.log('marcarpublicidadleida', x);
      }));
  }

  //---------COMENTARIOS
  getComments(localid): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traercomentariosporlocal.php?localid="+localid
    );
  }

  postComment(localid, userid, comment): Observable<any> {
    console.log('t', userid);
    console.log('ser', userid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      localid: localid,
      usuarioid: userid, 
      comentario: comment,  
    });
      
    console.log('body_createComment', body);

    return this.httpPost.post(this.ApiUrl + "enviarcomentario.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAddComment', x);
      }));
  }

  //-------- SERVICIO -----------

  deleteLocal(localid): Observable<any>{
    console.log('localid', localid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      localid: localid,
    });
      
    console.log('borrarlocal', body);

    return this.httpPost.post(this.ApiUrl + "borrarlocal.php", body, options).pipe(
      tap(x => {
        console.log('vuelta_borrarlocal', x);
      }));
  }

  getSeguidores(localid): Observable<any>{
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerfavoritosporlocal.php?localid="+localid)
    .pipe(
      tap(x => {
        console.log('traerlocalesporusuario', x);
      })
    );
  }

  getMisLocales(userid): Observable<any> {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerlocalesporusuario.php?usuarioid="+userid)
    .pipe(
      tap(x => {
        console.log('traerlocalesporusuario', x);
      })
    );
  }

  descuentosLocal(localid): Observable<any> {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerdescuentosporlocal.php?localid="+localid)
    .pipe(
      tap(x => {
        console.log('vuelta_traerdescuentosporlocal', x);
      })
    );
  }

  actualizarDescuentoLocal(localid,categoriaid,descuento,fechavencimiento): Observable<any> {
    console.log('localid', localid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      localid: localid,
      categoriaid: categoriaid,
      descuento: descuento,
      fechavencimiento:fechavencimiento,
    });
      
    console.log('actualizardescuentolocal', body);

    return this.httpPost.post(this.ApiUrl + "actualizardescuentoslocal.php", body, options).pipe(
      tap(x => {
        console.log('vuelta_actualizardescuentolocal', x);
      }));
  }

  //----------------POST--------------
  createService(tienda,categorias,foto): Observable<any> {
    console.log('t', tienda);
    console.log('cat', categorias);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      nombre: tienda.nombre,
      email:tienda.email, 
      direccion: tienda.direcc, 
      telefono: tienda.telefono,
      horarioapertura: tienda.horaA,
      horariocierre: tienda.horaC, 
      categoria: categorias, 
      imagenes: foto,
      usuarioid: tienda.usuarioid, 
      placeid: tienda.placeid,
      //servicios: servicios, 
    });
      
    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "crearservicio.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAPiCreateServ', x);
      }));
  }

  //-------- FAVORITOS -----------
  //----------------POST--------------
  favorite(userid,perroid,valor): Observable<any> {
    console.log('t', userid);
    console.log('ser', userid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      perroid: perroid,
      usuarioid: userid, 
      valor: valor,  
    });
      
    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "agregarperrofavorito.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAddFavPerro', x);
      }));
  }

  addFavoriteLocal(userid,comercioid,valor): Observable<any> {
    console.log('t', userid);
    console.log('ser', userid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      usuarioid: userid,
      comercioid: comercioid, 
      valor: valor,  
    });
      
    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "actualizarfavorito.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAddFavLocal', x);
      }));
  }

  getMyFavorites(userid): Observable<any>{
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerfavoritos.php?usuarioid="+userid)
    .pipe(
      tap(x => {
        console.log('traerfavoritos', x);
      })
    );
  }

  traerFavoritoPerro(perroid, userid): Observable<any>{
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerfavoritoporperro.php?perroid="+perroid+"&usuarioid="+userid)
    .pipe(
      tap(x => {
        console.log('traerFavoritoPerro', x);
      })
    );
  }

  //---------------REFUGIOS---------------------
  //---AREGAR_PERRO_REFUGIO----------
  addDogRefugio(dog, fotos, refugioid): Observable<any> {
    console.log('t', refugioid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({ 
      nombre: dog.nombre,
      estado: dog.estado, 
      descripcion: dog.descripcion, 
      generoid: dog.gender,
      direccion: dog.direccion,
      fechanacimiento: dog.nacimiento, 
      razaid: dog.raza, 
      colorid: dog.color, 
      placeid: dog.placeid, 
      fotos: fotos,
      refugioid: refugioid  
      //servicios: servicios, 
    });
      
    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "agregarperrorefugio.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAPiagregarperrorefugio', x);
      }));
  }

  //---TRAER_MIS_REFUGIO----------
  getMyRefugios(userid){
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traermisrefugios.php?usuarioid="+userid)
    .pipe(
      tap(x => {
        console.log('traermisrefugios', x);
      })
    );
  }

  //---TRAER_PERROS_POR_REFUGIO----------
  getMyDogRefugios(refugioid){
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerperrosporrefugio.php?refugioid="+refugioid)
    .pipe(
      tap(x => {
        console.log('traermisrefugios', x);
      })
    );
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
      localidad:tienda.localidad,
      email:tienda.email, 
      telefono: tienda.telefono,
      horarioapertura: tienda.horaA,
      horariocierre: tienda.horaC, 
      categoria: tienda.category, 
      imagenes: foto,
      usuarioid: tienda.usuarioid, 
      //servicios: servicios, 
    });
      
    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "crearservicio.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAPiCreateServ', x);
      }));
  }
  
  getStores(categoriaId, userId): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerlocalesporcategoria.php?categoriaid="+categoriaId+"&usuarioid="+userId
    );
  }

  //---------------LOCALIDADES----------------
  getLocalidades(catId){
    return this.httpClient.get(
      this.ApiUrl + "traerlocalidades.php?categoriaid="+catId
    );
  }
  //-------------------------------------
  getDogData(dogid){
    return this.httpClient.get(
      this.ApiUrl + "traerperroporid.php?perroid="+dogid
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

  getLocalData(localid): Observable<any> {
    return this.httpClient.get("http://ctrlztest.com.ar/lupacan/apirest/traerlocalporid.php?localid="+localid)
    .pipe(
      tap(x => {
        console.log('traermisrefugios', x);
      })
    );
  }


}
