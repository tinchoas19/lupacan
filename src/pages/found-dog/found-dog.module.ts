import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoundDogPage } from './found-dog';

@NgModule({
  declarations: [
    FoundDogPage,
  ],
  imports: [
    IonicPageModule.forChild(FoundDogPage),
  ],
})
export class FoundDogPageModule {}
