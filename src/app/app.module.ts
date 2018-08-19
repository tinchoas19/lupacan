import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ServiceListPage } from "../pages/service-list/service-list";
import { ServiceDetailPage } from "../pages/service-detail/service-detail";
import { ServiPage } from "../pages/servi/servi";
import { LoginPage } from "../pages/login/login";
import { DogPage } from "../pages/dog/dog";
import { FeedPage } from "../pages/feed/feed";
import { ProfileSettingsPage } from '../pages/profile-settings/profile-settings';
import { MyDogsPage } from '../pages/my-dogs/my-dogs';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { FoundDogPage } from '../pages/found-dog/found-dog';
import { AddDogPage } from '../pages/add-dog/add-dog';
import { CreateServicePage } from '../pages/create-service/create-service';
import { PhotoSliderPage } from '../pages/photo-slider/photo-slider';
import { ModalOfferedServicesPage } from '../pages/modal-offered-services/modal-offered-services';
import { MyServicesPage } from '../pages/my-services/my-services';


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
    MyServicesPage
  ],
  imports: [
    BrowserModule,
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
    MyServicesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
