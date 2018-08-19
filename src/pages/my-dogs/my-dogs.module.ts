import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyDogsPage } from './my-dogs';

@NgModule({
  declarations: [
    MyDogsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyDogsPage),
  ],
})
export class MyDogsPageModule {}
