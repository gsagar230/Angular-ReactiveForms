import { Component, OnInit } from '@angular/core';
import { Customer } from './customer';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn  } from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm : FormGroup;
  customer = new Customer();

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {

    this.customerForm = this.fb.group({
      firstName : ['',[ Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required]
      }, { validator : emailGroupValidator }),      
      sendCatalog: false,
      phone:'',
      notification:'email',
      rating:[null, rangeValidator(1, 5)]
    });
  }

  save(): void {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setDefaultData(): void {
    this.customerForm.patchValue({ 
        firstName : 'sagar',
        lastName : 'G',
        sendCatalog : false,
        emailGroup : {
          email : 'sagar@gmail.com',
          confirmEmail : 'sagar@gmail.com'
        }
      });
  }

  sendNotification(type:string):void {
    let phone = this.customerForm.get('phone');
    if(type === 'text')
      phone.setValidators(Validators.required);
    else
      phone.clearValidators();
    phone.updateValueAndValidity();
  }
}

function rangeValidator(min:number, max:number) : ValidatorFn {
  return (c : AbstractControl ) : { [key : string] : boolean } | null => {
    if(c.value > max || isNaN(c.value) || c.value< min)
      return { 'range' : true };
    return null;
  }
}

function emailGroupValidator(c:AbstractControl) : { [key : string] : boolean} | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail')

  if(emailControl.pristine || confirmEmailControl.pristine )
    return null;
  
  if(emailControl.value === confirmEmailControl.value)
    return null;
  return { 'match' : true };
}
