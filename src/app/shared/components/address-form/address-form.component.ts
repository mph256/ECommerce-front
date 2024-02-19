import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';
import { AddressService } from '../../services/address/address.service';
import { CountryService } from '../../services/country/country.service';

import { Address } from '../../models/address.model';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {

  @Output()
  cancelEvent = new EventEmitter<boolean>();

  isCheckoutPage!: boolean;

  formType!: 'add' | 'update';

  addressForm!: FormGroup;

  nameCtrl!: FormControl;
  streetCtrl!: FormControl;
  cityCtrl!: FormControl;
  zipcodeCtrl!: FormControl;

  countries$!: Observable<Country[]>;

  address!: Address;

  loading = false;

  message!: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, 
    private authService: AuthService, private addressService: AddressService, private countryService: CountryService) { }

  ngOnInit(): void {

    this.isCheckoutPage = this.router.url.includes('/checkout');

    this.formType = this.router.url.includes('/edit')?'update':'add';

    this.initForm();

    if('update' === this.formType) {

      this.addressService.getAddressById(this.activatedRoute.snapshot.params['addressId']).pipe(
        tap(address => { 

          this.address = address;

          this.addressForm.patchValue({
            name: address.name,
            street: address.street,
            city: address.city,
            zipcode: address.zipcode,
            country: address.country
          });

        })
      ).subscribe();

    }

    this.countries$ = this.countryService.getCountries();

  }

  initForm(): void {

    this.nameCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
    this.streetCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]);
    this.cityCtrl = this.formBuilder.control(null, [Validators.required, Validators.minLength(3), Validators.maxLength(139)]);
    this.zipcodeCtrl = this.formBuilder.control(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(5), Validators.maxLength(5)]);

    this.addressForm = this.formBuilder.group({
      name: this.nameCtrl,
      street: this.streetCtrl,
      city: this.cityCtrl,
      zipcode: this.zipcodeCtrl,
      country: [null, Validators.required]
    });

  }

  compareCountries(country1: Country, country2: Country): boolean {

    if(country2)
      return (country1.id === country2.id);
    else
      return false;

  }

  getFormControlName(control: AbstractControl): string | null {
    return Object.entries(control.parent?.controls ?? []).find(([_, value]) => value === control)?.[0] ?? null;
  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('required'))
      return 'This field is required';
    else if(ctrl.hasError('pattern'))
      return 'Your zipcode is invalid';
    else if(ctrl.hasError('minlength') || ctrl.hasError('maxlength')) {

      if('name' === this.getFormControlName(ctrl))
        return 'Your name must be between 3 and 50 characters long';
      else if('street' === this.getFormControlName(ctrl))
        return 'Your street must be between 3 and 255 characters long';
      else if('city' === this.getFormControlName(ctrl))
        return 'Your street must be between 3 and 139 characters long';
      else
        return 'Your zipcode must be 5 characters long';

    } else
      return 'This field contains an error';

  }

  onSubmit(): void {

    this.loading = true;

    if('add' === this.formType) {

      this.addressService.addAddress(this.addressForm.value.name, this.addressForm.value.street, this.addressForm.value.city, this.addressForm.value.zipcode, this.addressForm.value.country,
        this.authService.getUserUsername());

      this.addressForm.reset();

      this.loading = false;
      
      if(this.isCheckoutPage)
        this.cancelEvent.emit(true);
      else
        this.router.navigateByUrl('/account/addresses');

    } else {

      this.addressService.updateAddress(this.address, this.addressForm.value.name, 
        this.addressForm.value.street, this.addressForm.value.city, this.addressForm.value.zipcode, this.addressForm.value.country).pipe(
        tap(() => this.router.navigateByUrl('/account/addresses')),
        catchError(error => {

          this.message = 'An error has occurred';

          setTimeout(() => { 
            this.message = '';
          }, 5000);

          throw error;

        }),
        finalize(() => this.loading = false)
      ).subscribe();

    }

  }

  onCancel(): void {

    if(this.isCheckoutPage)
      this.cancelEvent.emit(true);
    else
      this.router.navigateByUrl('/account/addresses');

  }

}
