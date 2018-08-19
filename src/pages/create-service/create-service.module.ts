import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateServicePage } from './create-service';

@NgModule({
  declarations: [
    CreateServicePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateServicePage),
  ],
})
export class CreateServicePageModule {}
