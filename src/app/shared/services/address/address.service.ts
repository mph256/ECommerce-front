import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { Address } from '../../models/address.model';
import { Country } from '../../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private _addresses$ = new BehaviorSubject<Address[]>([]);
  get addresses$(): Observable<Address[]> {
    return this._addresses$.asObservable();
  }

  constructor(private http: HttpClient) { }

  getAddressById(addressId: number): Observable<Address> {
    return this.http.get<Address>(`${environment.apiUrl}/addresses/${addressId}`);
  } 

  getUserAddresses(username: string): void {
    this.http.get<Address[]>(`${environment.apiUrl}/addresses/users/${username}`).pipe(
      tap(addresses => this._addresses$.next(addresses))
    ).subscribe();
  }

  addAddress(name: string, street: string, city: string, zipcode: string, country: Country, username: string): void {

    const formData = new FormData();

    formData.append('name', name);
    formData.append('street', street);
    formData.append('city', city);
    formData.append('zipcode', zipcode);
    formData.append('countryId', country.id as unknown as string);
    formData.append('username', username);

    this.http.post<Address>(
      `${environment.apiUrl}/addresses`,
      formData
    ).pipe(
      map(addressToAdd => { const addresses = this._addresses$.getValue(); addresses.forEach(address => { address.isDefaultShipping = false; address.isDefaultBilling = false; });
        addresses.push(addressToAdd); return addresses; }),
      tap(addresses => this._addresses$.next(addresses))
    ).subscribe();

  }

  updateAddress(address: Address, name: string, street: string, city: string, zipcode: string, country: Country): Observable<Address> {

    const formData = new FormData();

    formData.append('name', name);
    formData.append('street', street);
    formData.append('city', city);
    formData.append('zipcode', zipcode);
    formData.append('countryId', country.id as unknown as string);

    return this.http.patch<Address>(
      `${environment.apiUrl}/addresses/${address.id}`,
      formData
    );

  }

  updateUserDefaultShippingAddress(newShippingAddress: Address): void {

    const formData = new FormData();

    formData.append('addressId', newShippingAddress.id as unknown as string);

    this.http.patch<Address>(
      `${environment.apiUrl}/addresses/${newShippingAddress.id}/shipping`,
      formData
    ).pipe(
      map(addressToUpdate => { const addresses = this._addresses$.getValue(); 
        const address = addresses.find(address => addressToUpdate.id === address.id)
        if(address) { address.isDefaultShipping = true; } return addresses; }),
      map(addresses => { addresses.filter(address => newShippingAddress.id !== address.id).forEach(address => address.isDefaultShipping = false); return addresses; }),
      tap(addresses => this._addresses$.next(addresses))
    ).subscribe();
  
  }

  updateUserDefaultBillingAddress(newBillingAddress: Address): void {

    const formData = new FormData();

    formData.append('addressId', newBillingAddress.id as unknown as string);

    this.http.patch<Address>(
      `${environment.apiUrl}/addresses/${newBillingAddress.id}/billing`,
      formData
    ).pipe(
      map(addressToUpdate => { const addresses = this._addresses$.getValue(); const address = addresses.find(address => addressToUpdate.id === address.id)
        if(address) { address.isDefaultBilling = true; } return addresses; }),
      map(addresses => { addresses.filter(address => newBillingAddress.id !== address.id).forEach(address => address.isDefaultBilling = false); return addresses; }),
      tap(addresses => this._addresses$.next(addresses))
    ).subscribe();

  }

  deleteAddress(address: Address): void {
    this.http.delete<Address>(`${environment.apiUrl}/addresses/${address.id}`).pipe(
      tap(addressToDelete => this._addresses$.next(this._addresses$.getValue().filter(address => addressToDelete.id !== address.id)))
    ).subscribe();
  }

}
