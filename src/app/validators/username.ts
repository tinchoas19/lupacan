import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiProvider } from './../../providers/api/api';


@Injectable()
export class UsernameValidator {

  debouncer: any;

  constructor(public authProvider: ApiProvider){

  }

  checkUsername(control: FormControl): any {

    clearTimeout(this.debouncer);

    return new Promise(resolve => {

      this.debouncer = setTimeout(() => {

        this.authProvider.validateUsername(control.value.toLowerCase()).subscribe((res) => {
            console.log('control.value',control.value);
            if(res){
                console.log('res_validateUsername',res);
                //resolve(null);
                resolve({
                    "username taken": true
                });
          }
        }, (err) => {
          resolve({'usernameInUse': true});
        });

      }, 1000);      

    });
  }

}