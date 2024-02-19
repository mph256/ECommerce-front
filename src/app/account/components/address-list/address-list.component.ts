import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { AddressService } from '../../../shared//services/address/address.service';

import { Address } from '../../../shared/models/address.model';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  addresses$!: Observable<Address[]>;

  addressesToShow!: Address[];

  addressesPerPage = 15;

  cols = 5;

  constructor(private router: Router, private authService: AuthService, private addressService: AddressService) { }

  ngOnInit(): void {

     this.addressService.getUserAddresses(this.authService.getUserUsername());
     this.addresses$ = this.addressService.addresses$.pipe(
      tap(addresses => this.addressesToShow = addresses.slice(0, this.addressesPerPage))
    );

    this.resize(window.innerWidth);

  }

  resize(innerWidth: number): void {

    if(innerWidth > 1679)
      this.cols = 5;

    if(innerWidth <= 1679)
      this.cols = 4;

    if(innerWidth <= 1356)
      this.cols = 3;

    if(innerWidth <= 1033)
      this.cols = 2;

    if(innerWidth <= 710)
      this.cols = 1;

  }

  onAddAddress(): void {
    this.router.navigateByUrl('/account/addresses/add');
  }

  onEditAddress(address: Address): void {
    this.router.navigateByUrl(`/account/addresses/${address.id}/edit`);
  }

  onDeleteAddress(address: Address): void {
    this.addressService.deleteAddress(address);
  }

  onSetDefaultAddress(address: Address): void {

    this.addressService.updateUserDefaultShippingAddress(address);
    this.addressService.updateUserDefaultBillingAddress(address);

  }

  onResize(event: any) {
    this.resize(event.target.innerWidth);
  }

  onPage(event: PageEvent, addresses: Address[]): void {

    this.addressesPerPage = (event.pageIndex > 0)?15:14;

    this.addressesToShow = addresses.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);

  }

}
