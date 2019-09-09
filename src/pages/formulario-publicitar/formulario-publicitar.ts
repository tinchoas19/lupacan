import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsernameValidator } from '../../app/validators/username';

/**
 * Generated class for the FormularioPublicitarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-formulario-publicitar',
  templateUrl: 'formulario-publicitar.html',
})
export class FormularioPublicitarPage {

  public myForm: FormGroup;
  public submitAttempt: boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public usernameValidator: UsernameValidator,
  ) {
    this.myForm = formBuilder.group({
      razon:['',Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],//Contener letras y espacios, y tener menos de 30 caracteres.
      telefono:['',Validators.required],      
      direcc:['', Validators.required],//Contener letras y espacios, y tener menos de 30 caracteres.
      email:['',Validators.compose([Validators.maxLength(30),Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]), usernameValidator.checkUsername.bind(usernameValidator)],
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormularioPublicitarPage');
  }

}
