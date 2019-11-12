import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
import { Events } from 'ionic-angular';
import { getDayOfYear } from 'date-fns';

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

  ApiUrl = "https://ctrlztest.com.ar/lupacan/apirest/";
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
  ) {
    this.storage.get('datauser').then(val => {
      if (val != null) {
        this.usuarioId = val['usuarioid'];
      }
    })
  }

  //--------LOGIN--------
  validarUsuario(firebaseUser, usuario, pass): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/validarusuario.php?usuario=" + usuario + "&password=" + pass + "&firebaseusuarioid=" + firebaseUser)
      .pipe(
        tap(x => {
          console.log('validar usuario', x);
        })
      );
  }

  validateUsername(username): Observable<any> {
    console.log('username_validaremailexiste', username);
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/validaremailexiste.php?email=" + username)
      .pipe(
        tap(x => {
          console.log('validaremailexiste', x);
        })
      );
  }

  validarUserFb(id, firebaseusuarioid, userName, userEmail, nac): Observable<any> {
    console.log('yendo a valida fb', id);
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/validarusuariofb.php?facebookid=" + id + "&firebaseusuarioid=" + firebaseusuarioid + "&nombre=" + userName + "&email=" + userEmail + "&fechanacimiento=" +nac)
      .pipe(
        tap(x => {
          console.log('validar fbId', x);
        })
      );
  }
  //-------- USUARIO -----------
  getUser(userId): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerperfilusuario.php?usuarioid=" + userId)
      .pipe(
        tap(x => {
          console.log('validar usuario', x);
        })
      );
  }

  //------------------- NOTIFICACIONES USUARIO ----------------
  getNotificacionesUser(userId): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traernotificaciones.php?usuarioid=" + userId)
      .pipe(
        tap(x => {
          console.log('notificaciones usuario', x);
        })
      );
  }

  getNotificacionesSinLeer(userId): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traernotificacionessinleer.php?usuarioid=" + userId)
      .pipe(
        tap(x => {
          console.log('notificaciones usuario', x);
        })
      );
  }

  //-------------------USUARIO UPDATE UBICACION----------------
  actualizarPositionUser(userid, lat, lng): Observable<any> {
    console.log('user', userid, lat, lng);

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

  //--------------------PERRO ENCONTRADO--------------------
  addPerroEncontrado(dog, fotos): Observable<any> {
    console.log('perroPerdido', );

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: dog.usuarioid,
      descripcion: dog.descripcion,
      generoid: dog.gender,
      razaid: dog.raza,
      colorid: dog.color,
      direccion: dog.direccion,
      placeid: dog.placeid,
      fotos: fotos
    });

    console.log('body_perroEncontrado', body);

    return this.httpPost.post(this.ApiUrl + "agregarperroencontrado.php", body, options).pipe(
      tap(x => {
        console.log('add_perroEncontrado', x);
      }));
  }
  //POST--------------------
  marcarDogPerdido(userid, perroid, lat, lng, estadoplaceid, estadodireccion): Observable<any> {
    console.log('perroPerdido', userid, perroid, lat, lng);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: userid,
      perroid: perroid,
      latitud: new String(lat),
      longitud: new String(lng),
      estadoplaceid: estadoplaceid,
      estadodireccion: estadodireccion
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "marcarcomoperdido.php", body, options).pipe(
      tap(x => {
        console.log('perroPerdido', x);
      }));
  }

  marcarEnCasa(usuarioid, perroid): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: usuarioid,
      perroid: perroid,
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "marcarcomocasa.php", body, options).pipe(
      tap(x => {
        console.log('marcarcomocasa', x);
      }));
  }

  marcarDogEncontrado(userid, perroid, estadodireccion, estadoplaceid): Observable<any> {
    console.log('perroPerdido', userid, perroid);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: userid,
      perroid: perroid,
      estadodireccion: estadodireccion,
      estadoplaceid: estadoplaceid
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "marcarcomoencontrado.php", body, options).pipe(
      tap(x => {
        console.log('perroEncontrado', x);
      }));
  }

  quieroAdoptar(userid, perroid): Observable<any> {
    console.log('quieroAdoptar', userid, perroid);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: userid,
      perroid: perroid,
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "quieroadoptar.php", body, options).pipe(
      tap(x => {
        console.log('quieroAdoptar', x);
      }));
  }


  //------PUSH NOTIFICATION---------------
  probarPush(userId): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/probarpush.php?id=" + userId)
      .pipe(
        tap(x => {
          console.log('Probar push', x);
        })
      );
  }

  //-------- BITACORA CALLEJERITO -----------
  //-POST--------------
  addHistorial(usuarioid,perro, text): Observable<any> {
    let fecha = new Date();
    console.log('fecha', fecha);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid : usuarioid,
      texto : text,
      fecha : fecha,
      perroid :perro.perroid
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "agregarbitacora.php", body, options).pipe(
      tap(x => {
        console.log('bitacora', x);
      }));
  }

  //-------- BITACORA CALLEJERITO -----------
  //-PEDIR TENENCIA--------------
  pedirTenenciaCalle(usuarioid, perroid): Observable<any> {
    console.log('user', usuarioid);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: usuarioid,
      perroid: perroid
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "pedirtenencia.php", body, options).pipe(
      tap(x => {
        console.log('pedirtenencia.php', x);
      }));
  }

  //-------- BITACORA CALLEJERITO -----------
  //-GET--------------
  getBitacora(perroid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerbitacora.php?perroid=" + perroid)
      .pipe(
        tap(x => {
          console.log('Bitacora GET', x);
        })
      );
  }

  //-------- USER REGISTRO -----------
  //-POST--------------
  createUser(user, foto, facebookid, firebaseusuarioid): Observable<any> {
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
      firebaseusuarioid: firebaseusuarioid,
      facebookid: facebookid ? facebookid : 0
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "crearusuario.php", body, options).pipe(
      tap(x => {
        console.log('createUser', x);
      }));
  }

  //-------- USER ULTIMOS AGREGADOS -----------
  getUltimosAgregadosUsuarios(): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerultimosusuariosagregados.php")
      .pipe(
        tap(x => {
          console.log('Ultimos Agregados', x);
        })
      );
  }
  //-------- TODOS USERS -----------
  getAllUsers(userid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerusuarios.php?usuarioid=" + userid)
      .pipe(
        tap(x => {
          console.log('Ultimos Agregados', x);
        })
      );
  }


  //-------- UPDATE USER -----------
  //-POST--------------
  updateUser(user, direccion, usuarioid, foto): Observable<any> {
    console.log('user', user);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: usuarioid,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      direccion: direccion,
      password: user.password,
      fechanacimiento: user.edad,
      imagen: foto
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "actualizarusuario.php", body, options).pipe(
      tap(x => {
        console.log('createUser', x);
      }));
  }
  //-------- RECUPERO_PASS -----------
  //-POST--------------
  recuperoPass(data): Observable<any> {
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
  getUltimosAgregados(): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerultimosagregados.php")
      .pipe(
        tap(x => {
          console.log('Ultimos Agregados', x);
        })
      );
  }

  //-------- BUSCAR -------
  buscar(val): Observable<any> {
    return this.httpClient.get('https://ctrlztest.com.ar/lupacan/apirest/busqueda.php?texto=' + val);
  }

  //-------- CHAT -------
  getMisChats(usuarioid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerchats.php?usuarioid=" + usuarioid)
      .pipe(
        tap(x => {
          console.log('chat', x);
        })
      );
  }
  getChat(origenid, origentipo, destinoid, destinotipo): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traermensajeschat2.php?origenid=" + origenid + "&origentipo=" + origentipo + "&destinoid=" + destinoid + "&destinotipo=" + destinotipo)
      .pipe(
        tap(x => {
          console.log('chat', x);
        })
      );
  }

  getChatNoLeidos(origenid, origentipo, destinoid, destinotipo): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traermensajeschatnoleidos.php?origenid=" + origenid + "&origentipo=" + origentipo + "&destinoid=" + destinoid + "&destinotipo=" + destinotipo)
      .pipe(
        tap(x => {
          console.log('chat', x);
        })
      );
  }

  //-------- CHAT SERVICE -------
  getMisChatsService(localid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerchatslocal.php?localid=" + localid)
      .pipe(
        tap(x => {
          console.log('chat', x);
        })
      );
  }

  //-------- SEND MESSAGE -------
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

  sendMsg(msg: ChatMessage, tipodestino, tipoorigen) {
    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    const requestOptions = new RequestOptions({ headers: headers });

    var body = JSON.stringify({ tipodestino: tipodestino, tipoorigen: tipoorigen, destinoid: msg.destinoId, origenid: msg.userId, mensaje: msg.message });
    console.log(body);
    return this.httpPost.post("https://ctrlztest.com.ar/lupacan/apirest/enviarchat.php", body, { headers: headers, withCredentials: true });
    /* return new Promise(resolve => setTimeout(() => resolve(msg), Math.random() * 1000))
      .then(() => this.mockNewMsg(msg)); */
  }

  //---------------------

  //-------- SERVICIO -----------

  getServiciosdeLocal(): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerserviciosdelocal.php")
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
      this.ApiUrl + "traerlocales.php?usuarioid=" + userid
    );
  }

  //-------- SERVICIO -----------
  //-------- PEMIUM -----------
  localPremium(localid,valor): Observable<any> {
    console.log('localid', localid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      localid: localid,
      valor:valor,
    });

    console.log('body_marcarlocalPremium', body);

    return this.httpPost.post(this.ApiUrl + "marcarlocalpremium.php", body, options).pipe(
      tap(x => {
        console.log('vuelta_LocalPremium', x);
      }));
  }
  //-------- PUBLICIDAD -----------
  getPaquetesPublicidad(): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerpaquetespublicidad.php"
    );
  }

  comprarPublicidad(form, paqueteid, userid, precio): Observable<any> {
    console.log('t', form);
    console.log('ser', precio);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      paqueteid: paqueteid,
      razonsocial: form.razon,
      email: form.email,
      direccion: form.direcc,
      telefono: form.telefono,
      precio: precio,
      usuarioid: userid
    });

    console.log('body_compraPublicidad', body);

    return this.httpPost.post(this.ApiUrl + "comprarpublicidad.php", body, options).pipe(
      tap(x => {
        console.log('comprarpublicidad', x);
      }));
  }
  //-------- BANNERS -----------
  getPublicidad(tipo, localidadid): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerpublicidad.php?tipo=" + tipo + "&localidadid=" + localidadid
    );
  }

  publicidadLeida(publicidadid, usuarioid): Observable<any> {
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
      this.ApiUrl + "traercomentariosporlocal.php?localid=" + localid
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

  deleteLocal(localid): Observable<any> {
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

  getSeguidores(localid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerfavoritosporlocal.php?localid=" + localid)
      .pipe(
        tap(x => {
          console.log('traerlocalesporusuario', x);
        })
      );
  }

  getMisLocales(userid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerlocalesporusuario.php?usuarioid=" + userid)
      .pipe(
        tap(x => {
          console.log('traerlocalesporusuario', x);
        })
      );
  }

  descuentosLocal(localid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerdescuentosporlocal.php?localid=" + localid)
      .pipe(
        tap(x => {
          console.log('vuelta_traerdescuentosporlocal', x);
        })
      );
  }

  mostrarTelefono(usuarioid, mostrarTelefono): Observable<any> {
    console.log('usuarioid', usuarioid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: usuarioid,
      mostrartelefono: mostrarTelefono,
    });

    console.log('mostrarTelefono', body);

    return this.httpPost.post(this.ApiUrl + "actualizarmostrartelefono.php", body, options).pipe(
      tap(x => {
        console.log('vuelta_mostrarTelefono', x);
      }));
  }

  actualizarDescuentoLocal(localid, categoriaid, descuento, fechavencimiento): Observable<any> {
    console.log('localid', localid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      localid: localid,
      categoriaid: categoriaid,
      descuento: descuento,
      fechavencimiento: fechavencimiento,
    });

    console.log('actualizardescuentolocal', body);

    return this.httpPost.post(this.ApiUrl + "actualizardescuentoslocal.php", body, options).pipe(
      tap(x => {
        console.log('vuelta_actualizardescuentolocal', x);
      }));
  }

  //----------------POST--------------
  createService(tienda, categorias, foto): Observable<any> {
    console.log('t', tienda);
    console.log('cat', categorias);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      nombre: tienda.nombre,
      email: tienda.email,
      direccion: tienda.direcc,
      telefono: tienda.telefono,
      localidad: tienda.localidad,
      categoria: categorias,
      imagenes: foto,
      usuarioid: tienda.usuarioid,
      placeid: tienda.placeid,
      lunesabre: tienda.horarios[0].abre,
      lunescierra: tienda.horarios[0].cierra,
      martesabre: tienda.horarios[1].abre,
      martescierra: tienda.horarios[1].cierra,
      miercolesabre: tienda.horarios[2].abre,
      miercolescierra: tienda.horarios[2].cierra,
      juevesabre: tienda.horarios[3].abre,
      juevescierra: tienda.horarios[3].cierra,
      viernesabre: tienda.horarios[4].abre,
      viernescierra: tienda.horarios[4].cierra,
      sabadoabre: tienda.horarios[5].abre,
      sabadocierra: tienda.horarios[5].cierra,
      domingoabre: tienda.horarios[6].abre,
      domingocierra: tienda.horarios[6].cierra,
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
  favorite(userid, perroid, valor): Observable<any> {
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

  addFavoriteLocal(userid, comercioid, valor): Observable<any> {
    console.log('t', userid);
    console.log('ser', userid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: userid,
      localid: comercioid,
      valor: valor,
    });

    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "agregarlocalfavorito.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAddFavLocal', x);
      }));
  }

  addFavoriteUser(userid, usuariofavid, valor): Observable<any> {
    console.log('t', userid);
    console.log('ser', userid);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: userid,
      usuariofavoritoid: usuariofavid,
      valor: valor,
    });

    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "agregarusuariofavorito.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAddFavLocal', x);
      }));
  }

  getFavLocal(usuarioid, localid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerfavoritoporlocal.php?usuarioid=" + usuarioid + "&localid=" + localid)
      .pipe(
        tap(x => {
          console.log('traerfavoritos', x);
        })
      );
  }

  getFavDog(usuarioid, perroid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerfavoritoporperro.php?usuarioid=" + usuarioid + "&perroid=" + perroid)
      .pipe(
        tap(x => {
          console.log('traerfavoritos', x);
        })
      );
  }

  //---------TRANSFERIR TENENCIA-------------
  buscarUsuarios(val): Observable<any> {
    return this.httpClient.get('https://ctrlztest.com.ar/lupacan/apirest/buscarusuario.php?texto=' + val);
  }

  enviarSolicitudTrasnfer(userDestino, perroid, tipo): Observable<any> {
    console.log('t', userDestino);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: userDestino,
      perroid: perroid,
      tipo: tipo
    });

    console.log('body_enviarsolicitudtransferencia', body);

    return this.httpPost.post(this.ApiUrl + "enviarsolicitudtransferencia.php", body, options).pipe(
      tap(x => {
        console.log('enviarsolicitudtransferencia', x);
      }));
  }

  //---------TRANSFERIR PERRO-------------
  transferirPerro(userDestino, perroid,tipo,res): Observable<any> {
    console.log('t', userDestino);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: userDestino,
      perroid: perroid,
      tipo:tipo,
      respuesta: res
    });

    console.log('body_enviarsolicitudtransferencia', body);

    return this.httpPost.post(this.ApiUrl + "transferirperro.php", body, options).pipe(
      tap(x => {
        console.log('enviarsolicitudtransferencia', x);
      }));
  }
  getFavUser(usuarioid, usuariofavoritoid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerfavoritoporusuario.php?usuarioid=" + usuarioid + "&usuariofavoritoid=" + usuariofavoritoid)
      .pipe(
        tap(x => {
          console.log('traerfavoritos', x);
        })
      );
  }

  getMyFavorites(userid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerfavoritos.php?usuarioid=" + userid)
      .pipe(
        tap(x => {
          console.log('traerfavoritos', x);
        })
      );
  }

  traerFavoritoPerro(perroid, userid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerfavoritoporperro.php?perroid=" + perroid + "&usuarioid=" + userid)
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
      refugioid: refugioid,
      fotos: fotos,
      //servicios: servicios, 
    });

    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "agregarperrorefugio.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAPiagregarperrorefugio', x);
      }));
  }

  //---TRAER_MIS_REFUGIO----------
  getMyRefugios(userid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traermisrefugios.php?usuarioid=" + userid)
      .pipe(
        tap(x => {
          console.log('traermisrefugios', x);
        })
      );
  }

  //---TRAER_PERROS_POR_REFUGIO----------
  getMyDogRefugios(refugioid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerperrosporrefugio.php?refugioid=" + refugioid)
      .pipe(
        tap(x => {
          console.log('traermisrefugios', x);
        })
      );
  }


  //-------- EDITAR SERVICIO -----------
  //----------------POST--------------
  updateService(tienda, categorias, foto): Observable<any> {
    console.log('t', tienda);
    console.log('ser', categorias);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      localid: tienda.localid,
      nombre: tienda.nombre,
      email: tienda.email,
      direccion: tienda.direcc,
      telefono: tienda.telefono,
      localidad: tienda.localidad,
      categoria: categorias,
      imagenes: foto,
      usuarioid: tienda.usuarioid,
      placeid: tienda.placeid,
      lunesabre: tienda.horarios[0].abre,
      lunescierra: tienda.horarios[0].cierra,
      martesabre: tienda.horarios[1].abre,
      martescierra: tienda.horarios[1].cierra,
      miercolesabre: tienda.horarios[2].abre,
      miercolescierra: tienda.horarios[2].cierra,
      juevesabre: tienda.horarios[3].abre,
      juevescierra: tienda.horarios[3].cierra,
      viernesabre: tienda.horarios[4].abre,
      viernescierra: tienda.horarios[4].cierra,
      sabadoabre: tienda.horarios[5].abre,
      sabadocierra: tienda.horarios[5].cierra,
      domingoabre: tienda.horarios[6].abre,
      domingocierra: tienda.horarios[6].cierra,
      //servicios: servicios, 
    });

    console.log('body_createServ', body);

    return this.httpPost.post(this.ApiUrl + "actualizarservicio.php", body, options).pipe(
      tap(x => {
        console.log('vueltaAPiCreateServ', x);
      }));
  }

  getStores(categoriaId, userId): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerlocalesporcategoria.php?categoriaid=" + categoriaId + "&usuarioid=" + userId
    );
  }

  //---------------CONTROL DECIDI----------------
  controlDecicidir(): Observable<any> {
    return this.httpClient.get('https://developers.decidir.com/api/v1/healthcheck');
  }

  //---------------COLLARES----------------
  scanCodeCollar(codigo): Observable<any> {
    return this.httpClient.get('https://ctrlztest.com.ar/lupacan/apirest/traerperroporcodigo.php?codigo=' + codigo);
  }

  //---------------MARCAR EN ADOPCION----------------
  marcarenAdopcion(usuarioid, perroid): Observable<any> {

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: usuarioid,
      perroid: perroid
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "marcarenadopcion.php", body, options).pipe(
      tap(x => {
        console.log('marcarcomoadopcion', x);
      }));
  }

  //---------------FireBase----------------
  updateFirebase(usuarioid, firebaseid): Observable<any> {

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      usuarioid: usuarioid,
      firebaseusuarioid: firebaseid
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "actualizarfirebase.php", body, options).pipe(
      tap(x => {
        console.log('createDog', x);
      }));
  }

  //---------------LOCALIDADES----------------
  getLocalidades(catId): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerlocalidades.php?categoriaid=" + catId
    );
  }
  //-------------------------------------
  getDogData(dogid): Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traerperroporid.php?perroid=" + dogid
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
      estado: dog.estado,
      nombre: dog.nombre,
      descripcion: dog.descripcion,
      generoid: dog.gender,
      direccion: dog.direccion,
      fechanacimiento: dog.nacimiento,
      esterilizado: dog.esterilizado,
      razaid: dog.raza,
      colorid: dog.color,
      usuarioid: dog.usuarioid,
      placeid: dog.placeid,
      fotos: fotos,
      codigo : dog.codigo,
      estadodireccion: dog.estadodireccion,
      estadoplaceid: dog.estadoplaceid,
      estadofecha: dog.estadofecha
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "agregarperro.php", body, options).pipe(
      tap(x => {
        console.log('createDog', x);
      }));
  }

  updateDog(dog, fotos): Observable<any> {
    console.log('dog', dog);
    console.log('fot', fotos);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    let options = new RequestOptions({ headers: headers, withCredentials: true });
    var body = JSON.stringify({
      perroid: dog.perroid,
      nombre: dog.nombre,
      descripcion: dog.descripcion,
      generoid: dog.gender,
      razaid: dog.raza,
      colorid: dog.color,
      direccion: dog.direccion,
      fechanacimiento: dog.nacimiento,
      placeid: dog.placeid,
      esterilizado: dog.esterilizado,
      fotos: fotos
    });

    console.log('body', body);

    return this.httpPost.post(this.ApiUrl + "actualizarperro.php", body, options).pipe(
      tap(x => {
        console.log('createDog', x);
      }));
  }

  getLocalData(localid): Observable<any> {
    return this.httpClient.get("https://ctrlztest.com.ar/lupacan/apirest/traerlocalporid.php?localid=" + localid)
      .pipe(
        tap(x => {
          console.log('traermisrefugios', x);
        })
      );
  }


}
