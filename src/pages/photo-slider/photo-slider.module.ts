import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotoSliderPage } from './photo-slider';

@NgModule({
  declarations: [
    PhotoSliderPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotoSliderPage),
  ],
})
export class PhotoSliderPageModule {}
