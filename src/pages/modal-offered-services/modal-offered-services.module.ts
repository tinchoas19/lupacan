import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalOfferedServicesPage } from './modal-offered-services';

@NgModule({
  declarations: [
    ModalOfferedServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalOfferedServicesPage),
  ],
})
export class ModalOfferedServicesPageModule {}
