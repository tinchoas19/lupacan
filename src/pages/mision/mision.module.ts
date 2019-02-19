import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisionPage } from './mision';

@NgModule({
  declarations: [
    MisionPage,
  ],
  imports: [
    IonicPageModule.forChild(MisionPage),
  ],
})
export class MisionPageModule {}
