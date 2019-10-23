import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiProvider } from './../../providers/api/api';


@Injectable()
export class UsernameValidator {

  debouncer: any;

  constructor(public authProvider: ApiProvider) {

  }

  checkUsername(control: FormControl): any {

    clearTimeout(this.debouncer);

    return new Promise(resolve => {

      this.debouncer = setTimeout(() => {

        this.authProvider.validateUsername(control.value.toLowerCase()).subscribe((res) => {
          console.log('control.value', control.value);
          if (!res['data']) {
            console.log('res_validateUsername', res['data']);
            //resolve(null);
            resolve(true);
          }
        }, (err) => {
          resolve(false);
        });

      }, 1000);

    });
  }

}