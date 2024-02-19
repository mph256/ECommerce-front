import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Order } from '../../../shared/models/order.model';
import { Item } from '../../../shared/models/item.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @Input()
  order!: Order;

  @Output()
  cancelOrderEvent = new EventEmitter<Order>();

  status!: 'NEW' | 'IN_PROGRESS' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

  items!: Item[];

  showAddress = false;

  loading = false;

  ngOnInit(): void {

    this.status = this.getOrderStatus();

    this.items = [];

    for(let suborder of this.order.suborders) {
      this.items = this.items.concat(suborder.items);
    }

  }

  getOrderStatus(): 'NEW' | 'IN_PROGRESS' | 'SHIPPED' | 'DELIVERED' | 'CANCELED' {

    if(this.order.suborders.find(suborder => 'CANCELED' === suborder.status) !== undefined)
      return 'CANCELED';

    if(this.order.suborders.find(suborder => 'SHIPPED' === suborder.status) !== undefined)
      return 'SHIPPED';

    if(this.order.suborders.find(suborder => 'IN_PROGRESS' === suborder.status) !== undefined)
      return 'IN_PROGRESS';

    if(this.order.suborders.find(suborder => 'NEW' === suborder.status) !== undefined)
      return 'NEW';

    return 'DELIVERED';

  }

  isLate(): boolean {
    return ['NEW', 'IN_PROGRESS', 'SHIPPED'].includes(this.status) && new Date() > new Date(this.order.deliveryDate);
  }

  isCancellable(): boolean {
    return ['NEW', 'IN_PROGRESS'].includes(this.status);
  }

  onMouseEnter(): void {
    this.showAddress = true;
  }

  onMouseLeave(): void {
    this.showAddress = false;
  }

  onCancelOrder(): void {

    this.loading = true;

    this.cancelOrderEvent.emit(this.order);

    this.status = 'CANCELED';

    this.loading = false;

  }

}
