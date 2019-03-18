import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiProvider {

  ApiUrl = "http://ctrlztest.com.ar/lupacan/apirest/";
  data: Observable<any>;
  usuarioId: number = 1;
  localId: number = 1;
  categoriaId: number = 1;

  constructor(private httpPost: Http,private httpClient: HttpClient) {}

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

  getMyDogs():Observable<any> {
    return this.httpClient.get(
      this.ApiUrl + "traermisperros.php?usuarioid=" + this.usuarioId
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
