import { IntDogUserPage } from "./../pages/int-dog-user/int-dog-user";
import { ListDogUserPage } from "./../pages/list-dog-user/list-dog-user";
import { ChatPage } from "./../pages/chat/chat";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

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
import { CategoriesPage } from "../pages/categories/categories";
import { ApiProvider } from "../providers/api/api";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { RelativeTimePipe } from "../pipes/relative-time/relative-time";

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { Camera } from "@ionic-native/camera";

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
    CategoriesPage,
    ChatPage,
    ListDogUserPage,
    IntDogUserPage,
    RelativeTimePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
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
    CategoriesPage,
    ChatPage,
    ListDogUserPage,
    IntDogUserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PhotoViewer,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    FileTransfer,
    // FileUploadOptions,
    FileTransferObject,
    File,
    Camera
  ]
})
export class AppModule {}
