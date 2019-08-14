import { Storage } from '@ionic/storage';
import { ApiProvider } from './../api/api';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class IntervalProvider {

  intervalHandle: any = null;
  locationUser: any={lat:'',lng:''};
  constructor(
    private geo: Geolocation,
    private api:ApiProvider,
    public storage: Storage
  ) {
    console.log('Hello IntervalProvider Provider');
  }

  toggleInterval() {
    if (this.intervalHandle === null) {
      this.intervalHandle = setInterval(() => {
        this.getCurrentPosition();
      }, 60000);
    } else {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  //Position
  getCurrentPosition(){
    this.storage.get('datauser').then(val=>{
      if(val != null){
        this.geo.getCurrentPosition().then((pos)=>{
          this.storage.set('locatioUser',{lat:pos.coords.latitude, lng:pos.coords.longitude});
          console.log('position', pos);
          this.api.actualizarPositionUser(val['usuarioid'],pos.coords.latitude,pos.coords.longitude).subscribe(x=>console.log('updateLocation',x))
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      }
    })
  }

}
