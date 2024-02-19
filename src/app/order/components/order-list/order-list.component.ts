import { Component, OnInit } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';

import { Observable} from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { OrderService } from '../../../shared/services/order/order.service';

import { Order } from '../../../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  orders$!: Observable<Order[]>;

  ordersToShow!: Order[];

  ordersPerPage = 3;

  constructor(private authService: AuthService, private orderService: OrderService) { }

  ngOnInit(): void {

    this.orderService.getUserOrders(this.authService.getUserUsername());
    this.orders$ = this.orderService.orders$.pipe(
      tap(orders => this.ordersToShow = orders.slice(0, this.ordersPerPage))
    );

  }

  onCancelOrder(order: Order): void {
    this.orderService.cancelOrder(order);
  }

  onPage(event: PageEvent, orders: Order[]): void {
    this.ordersToShow = orders.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
