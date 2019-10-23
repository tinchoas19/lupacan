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
    console.log('1');
    
      this.intervalHandle = setInterval(() => {
        this.getCurrentPosition();
      }, 30000);
    } else {
      console.log('2');
      
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
