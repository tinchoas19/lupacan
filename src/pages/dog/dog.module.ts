import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DogPage } from './dog';

@NgModule({
  declarations: [
    DogPage,
  ],
  imports: [
    IonicPageModule.forChild(DogPage),
  ],
})
export class DogPageModule {}
