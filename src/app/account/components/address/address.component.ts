import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Address } from '../../../shared/models/address.model';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {

  @Input()
  address!: Address;

  @Output()
  editAddressEvent = new EventEmitter<Address>();

  @Output()
  deleteAddressEvent = new EventEmitter<Address>();

  @Output()
  setDefaultAddressEvent = new EventEmitter<Address>();

  onEditAddress(): void {
    this.editAddressEvent.emit(this.address);
  }

  onDeleteAddress(): void {
    this.deleteAddressEvent.emit(this.address);
  }

  onSetDefaultAddress(): void {
    this.setDefaultAddressEvent.emit(this.address);
  }

}
