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
    RelativeTimePipe
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
  ],
  providers: [
    StatusBar,
    SplashScreen,

    PhotoViewer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    FileTransfer,
    Facebook,
    // FileUploadOptions,
    FileTransferObject,
    File,
    Camera,
    Crop,
    Base64,
    Geolocation,
    ConnectivityServiceProvider,
    GoogleMapsProvider,
    Network
  ]
})
export class AppModule {}
