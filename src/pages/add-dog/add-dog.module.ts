import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDogPage } from './add-dog';

@NgModule({
  declarations: [
    AddDogPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDogPage),
  ],
})
export class AddDogPageModule {}
