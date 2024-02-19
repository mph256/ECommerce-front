import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Subject } from 'rxjs';
import { takeUntil, finalize, tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { OrderService } from '../../services/order/order.service';
import { SuborderService } from '../../services/suborder/suborder.service';

import { Order } from '../../../shared/models/order.model';
import { Item } from '../../../shared/models/item.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  animations: [
    trigger('expandedDetails', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class OrderListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) 
  paginator!: MatPaginator;

  destroy$ = new Subject<boolean>();

  dataSourceOrders = new MatTableDataSource<{ id: number, status: string, orderDate: Date, deliveryOption: string, shippingAddress: string, customer: string }>([]);
  dataSourceItems = new MatTableDataSource<Item>([]);

  displayedColumnsOrders = ['id', 'status', 'orderDate', 'deliveryOption', 'shippingAddress', 'customer', 'actions'];
  displayedColumnsWithExpandOrders = [...this.displayedColumnsOrders, 'expand'];
  displayedColumnsItems = ['id', 'product', 'quantity', 'isGift'];

  expandedElement!: Order | null;

  orders!: Order[];
  items: Item[] = [];

  table: { id: number, status: string, orderDate: Date, deliveryOption: string, shippingAddress: string, customer: string }[] = [];

  ordersPerPage = 5;
  itemsPerPage = 5;

  loading = false;

  constructor(private authService: AuthService, private orderService: OrderService, private suborderService: SuborderService) { }

  ngOnInit(): void {

    this.orderService.getOrdersBySellerUsername(this.authService.getUserUsername());
    this.orderService.orders$.pipe(
      tap(orders => this.orders = orders),
      tap(orders => this.initTable(orders)),
      tap(() => this.dataSourceOrders.data = this.table),
      takeUntil(this.destroy$)
    ).subscribe();

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngAfterViewInit() {
    this.dataSourceOrders.paginator = this.paginator;
  }

  initTable(orders: Order[]): void {

    this.table = [];

    orders.forEach(order => 
      this.table.push({ 
        id: order.suborders[0].id, 
        status: order.suborders[0].status, 
        orderDate: order.orderDate, 
        deliveryOption: order.deliveryOption.name, 
        shippingAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city} ${order.shippingAddress.zipcode}, ${order.shippingAddress.country.name}`, 
        customer: `${order.user.firstname} ${order.user.lastname}` 
      })
    );

  }

  getOrderById(orderId: number): Order | undefined {
    return this.orders.find(order => orderId === order.id);
  }

  getOrderBySuborderId(suborderId: number): Order | undefined {

    for(let order of this.orders) {

      for(let suborder of order.suborders) {

        if(suborderId === suborder.id)
          return order;

      }

    }

    return undefined;

  }

  updateDataSourceItems(suborderId: number): void {

    const items = this.getOrderBySuborderId(suborderId)?.suborders[0].items;

    if(items) {

      this.items = items;

      this.dataSourceItems.data = items.slice(0, this.itemsPerPage);

    }

  }

  isLate(suborderId: number): boolean {

    const order = this.getOrderBySuborderId(suborderId);

    if(order)
      return 'IN_PROGRESS' === order.suborders[0].status && new Date() > new Date(order.deliveryDate);
    else
      return false;

  }

  isShippable(suborder: { id: number, status: string, orderDate: Date, deliveryOption: string, shippingAddress: string, customer: string }): boolean  {
    return 'IN_PROGRESS' === suborder.status;
  }

  onMarkAsShipped(suborderId: number): void {

    this.loading = true;

    this.suborderService.shipOrder(suborderId).pipe(
      tap(suborder => {

        const order = this.getOrderById(suborder.orderId);

        if(order)
          this.orderService.updateOrder(order);

      }),
      finalize(() => this.loading = false)
    ).subscribe();

  }

  onApplyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSourceOrders.filter = filterValue;

  }

  onPage(event: PageEvent): void {
    this.dataSourceItems.data = this.items.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
