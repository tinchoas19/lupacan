import { ComunidadPage } from './../pages/comunidad/comunidad';
import { ComUsersPage } from './../pages/com-users/com-users';
import { ModalSaludPage } from './../pages/modal-salud/modal-salud';
import { TransferenciaPage } from './../pages/transferencia/transferencia';
import { BuscarUsuariosPage } from './../pages/buscar-usuarios/buscar-usuarios';
import { SeccionesSaludPage } from './../pages/secciones-salud/secciones-salud';
import { SaludPage } from './../pages/salud/salud';
import { QrCollaresPage } from './../pages/qr-collares/qr-collares';
import { AddFavUserComponent } from './../components/add-fav-user/add-fav-user';
import { ListChatsServicePage } from './../pages/list-chats-service/list-chats-service';
import { ListChatsPage } from './../pages/list-chats/list-chats';
import { FormularioPublicitarPage } from './../pages/formulario-publicitar/formulario-publicitar';
import { FeedUsuariosPage } from './../pages/feed-usuarios/feed-usuarios';
import { EditDogUserPage } from './../pages/edit-dog-user/edit-dog-user';
import { DescuentosPage } from './../pages/descuentos/descuentos';
import { SlidePremiumPage } from './../pages/slide-premium/slide-premium';
import { RefugioPage } from './../pages/refugio/refugio';
import { MyFavoritesPage } from './../pages/my-favorites/my-favorites';
import { MisNotificacionesPage } from './../pages/mis-notificaciones/mis-notificaciones';
import { FiltrosPage } from './../pages/filtros/filtros';
import { ListCommentLocalPage } from './../pages/list-comment-local/list-comment-local';
import { Facebook } from '@ionic-native/facebook';
import { ProfileServiceUserPage } from './../pages/profile-service-user/profile-service-user';
import { BuscarPage } from './../pages/buscar/buscar';
import { RecuperoPassPage } from './../pages/recupero-pass/recupero-pass';
import { IntDogUserPage } from './../pages/int-dog-user/int-dog-user';
import { ListDogUserPage } from './../pages/list-dog-user/list-dog-user';
import { ChatPage } from './../pages/chat/chat';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { ServiceListPage } from "../pages/service-list/service-list";
import { ServiceDetailPage } from "../pages/service-detail/service-detail";
import { ServiPage } from "../pages/servi/servi";
import { LoginPage } from "../pages/login/login";
import { DogPage } from "../pages/dog/dog";
import { FeedPage } from "../pages/feed/feed";
import { ProfileSettingsPage } from "../pages/profile-settings/profile-settings";
import { MyDogsPage } from "../pages/my-dogs/my-dogs";
import { MyProfilePage } from "../pages/my-profile/my-profile";
import { FoundDogPage } from "../pages/found-dog/found-dog";
import { AddDogPage } from "../pages/add-dog/add-dog";
import { CreateServicePage } from "../pages/create-service/create-service";
import { PhotoSliderPage } from "../pages/photo-slider/photo-slider";
import { ModalOfferedServicesPage } from "../pages/modal-offered-services/modal-offered-services";
import { MyServicesPage } from "../pages/my-services/my-services";
import { EditServicePage } from "../pages/edit-service/edit-service";
import { RegisterPage } from "../pages/register/register";
import { MisionPage } from "../pages/mision/mision";
import { AgregarPage } from "../pages/agregar/agregar";
import { MainPage } from "../pages/main/main";
import { MenuPage } from "./../pages/menu/menu";
import { CategoriesPage } from "../pages/categories/categories";
import { ApiProvider } from "../providers/api/api";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { RelativeTimePipe } from "../pipes/relative-time/relative-time";
import { ReactiveFormsModule } from '@angular/forms';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Camera } from "@ionic-native/camera";
import { Crop } from '@ionic-native/crop';
import { Base64 } from '@ionic-native/base64';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { Network } from '@ionic-native/network';
import { Push } from '@ionic-native/push';
import { IntervalProvider } from '../providers/interval/interval';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Badge } from '@ionic-native/badge';
import { UsernameValidator } from './validators/username';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { PublicitarPage } from '../pages/publicitar/publicitar';
import { AddFavServComponent } from '../components/add-fav-serv/add-fav-serv';
import { AddFavDogComponent } from '../components/add-fav-dog/add-fav-dog';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { ComDogsPage } from '../pages/com-dogs/com-dogs';
import { CuidadoPage } from '../pages/cuidado/cuidado';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DogPage,
    FeedPage,
    LoginPage,
    ServiPage,
    ServiceDetailPage,
    ServiceListPage,
    ProfileSettingsPage,
    MyDogsPage,
    MyProfilePage,
    FoundDogPage,
    AddDogPage,
    CreateServicePage,
    PhotoSliderPage,
    ModalOfferedServicesPage,
    MyServicesPage,
    EditServicePage,
    RegisterPage,
    MisionPage,
    AgregarPage,
    MainPage,
    MenuPage,
    CategoriesPage,
    ChatPage,
    ListDogUserPage,
    IntDogUserPage,
    RecuperoPassPage,
    BuscarPage,
    ProfileServiceUserPage,
    ListCommentLocalPage,
    FiltrosPage,
    MisNotificacionesPage,
    MyFavoritesPage,
    RefugioPage,
    SlidePremiumPage,
    DescuentosPage,
    EditDogUserPage,
    FeedUsuariosPage,
    PublicitarPage,
    FormularioPublicitarPage,
    ListChatsPage,
    ListChatsServicePage,
    AddFavServComponent,
    AddFavDogComponent,
    AddFavUserComponent,
    QrCollaresPage,
    RelativeTimePipe,
    SaludPage,
    SeccionesSaludPage,
    BuscarUsuariosPage,
    ComDogsPage,
    ComUsersPage,
    ComunidadPage,
    CuidadoPage,
    TransferenciaPage,
    ModalSaludPage,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      backButtonIcon: 'md-arrow-back',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition'
    }),
    IonicImageViewerModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DogPage,
    FeedPage,
    LoginPage,
    ServiPage,
    ServiceDetailPage,
    ServiceListPage,
    ProfileSettingsPage,
    MyDogsPage,
    MyProfilePage,
    FoundDogPage,
    AddDogPage,
    CreateServicePage,
    PhotoSliderPage,
    ModalOfferedServicesPage,
    MyServicesPage,
    EditServicePage,
    RegisterPage,
    MisionPage,
    AgregarPage,
    MainPage,
    MenuPage,
    CategoriesPage,
    ChatPage,
    ListDogUserPage,
    IntDogUserPage,
    RecuperoPassPage,
    BuscarPage,
    ProfileServiceUserPage,
    ListCommentLocalPage,
    FiltrosPage,
    MisNotificacionesPage,
    MyFavoritesPage,
    RefugioPage,
    SlidePremiumPage,
    DescuentosPage,
    EditDogUserPage,
    FeedUsuariosPage,
    PublicitarPage,
    FormularioPublicitarPage,
    ListChatsPage,
    ListChatsServicePage,
    AddFavServComponent,
    AddFavDogComponent,
    AddFavUserComponent,
    QrCollaresPage,
    SaludPage,
    SeccionesSaludPage,
    BuscarUsuariosPage,
    ComDogsPage,
    ComUsersPage,
    ComunidadPage,
    CuidadoPage,
    TransferenciaPage,
    ModalSaludPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UsernameValidator,
    PhotoViewer,
    LocationAccuracy,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    FileTransfer,
    Facebook,
    // FileUploadOptions,
    FileTransferObject,
    File,
    InAppBrowser,
    Camera,
    Crop,
    Base64,
    BarcodeScanner,
    Push,
    Diagnostic,
    Geolocation,
    Badge,
    ConnectivityServiceProvider,
    GoogleMapsProvider,
    Network,
    IntervalProvider
  ]
})
export class AppModule {}
