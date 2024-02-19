import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { AuthService } from '../../../shared/services/auth/auth.service';
import { CartService } from '../../../shared/services/cart/cart.service';
import { AddressService } from '../../../shared/services/address/address.service';
import { CreditCardService } from '../../../shared/services/credit-card/credit-card.service';
import { PromotionService } from '../../services/promotion/promotion.service';
import { DeliveryOptionService } from '../../services/delivery-option/delivery-option.service';
import { OrderService } from '../../services/order/order.service';

import { Cart } from '../../../shared/models/cart.model';
import { Address } from '../../../shared/models/address.model';
import { CreditCard } from '../../../shared/models/credit-card.model';
import { Promotion } from '../../../shared/models/promotion.model';
import { DeliveryOption } from '../../../shared/models/delivery-option.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewChecked {

  mainShippingAddressForm!: FormGroup;
  updateShippingAddressForm!: FormGroup;
  mainPaymentForm!: FormGroup;
  mainCreditCardForm!: FormGroup;
  updateCreditCardForm!: FormGroup;
  mainBillingAddressForm!: FormGroup;
  updateBillingAddressForm!: FormGroup;
  promotionForm!: FormGroup;
  deliveryOptionForm!: FormGroup;

  shippingAddressCtrl!: FormControl;
  billingAddressCtrl!: FormControl;
  promotionCtrl!: FormControl;
  deliveryOptionCtrl!: FormControl;

  cart$!: Observable<Cart>;
  addresses$!: Observable<Address[]>;
  creditCards$!: Observable<CreditCard[]>;
  deliveryOptions$!: Observable<DeliveryOption[]>;

  addressesToShow!: Address[];

  addressesPerPage = 5;

  selection = new SelectionModel<CreditCard>(true);
  dataSource = new MatTableDataSource<CreditCard>([]);

  displayedColumns = ['select', 'number', 'holderName', 'expirationDate'];

  creditCardsPerPage = 5;

  promotion!: Promotion | null;

  estimatedDeliveryDate!: Date;

  productsInCart!: number;

  activeShippingAddressForm!: 'main' | 'update-address-shipping' | 'add-address-shipping';
  activePaymentForm!: 'main' | 'update-card-credit' | 'add-card-credit' | 'update-address-billing' | 'add-address-billing';

  loading = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder, private router: Router, private authService: AuthService, 
    private cartService: CartService, private addressService: AddressService, private creditCardService: CreditCardService, private promotionService: PromotionService,
    private deliveryOptionService: DeliveryOptionService, private orderService: OrderService) { }

  ngOnInit(): void {

    this.cart$ = this.cartService.cart$.pipe(
      tap(cart => {

        if(cart.items.length === 0)
          this.router.navigateByUrl('/cart');
        else
          this.productsInCart = this.getProductsInCart(cart);

      })
    );

    this.initShippingAddressForms();
    this.initPaymentForms();
    this.initDeliveryOptionForm();

    this.addressService.getUserAddresses(this.authService.getUserUsername());
    this.addresses$ = this.addressService.addresses$.pipe(
      tap(addresses => {

        if(addresses.length === 0) {

          this.activeShippingAddressForm = 'add-address-shipping';
          this.activePaymentForm = 'add-address-billing';

        } else {

          addresses.forEach(address => {
  
            if(address.isDefaultShipping)
              this.mainShippingAddressForm.patchValue({ address: address });

            if(address.isDefaultBilling)
              this.mainBillingAddressForm.patchValue({ address: address }); 

          });

          if(!this.mainShippingAddressForm.value.address)
            this.activeShippingAddressForm = 'update-address-shipping';
          else
            this.activeShippingAddressForm = 'main';

          if(!this.mainBillingAddressForm.value.address)
            this.activePaymentForm = 'update-address-billing';
          else
            this.activePaymentForm = 'main';

        }

      }),
      tap(addresses => this.addressesToShow = addresses.slice(0, this.addressesPerPage))
    );

    this.creditCardService.getUserCreditCards(this.authService.getUserUsername());
    this.creditCards$ = this.creditCardService.creditCards$.pipe(
      tap(creditCards => {

        if(creditCards.length === 0)
          this.activePaymentForm = 'add-card-credit';
        else {

          creditCards.forEach(creditCard => {

            if(creditCard.isDefault)
              this.mainCreditCardForm.patchValue({ creditCard: creditCard });

          });

          if(!this.mainCreditCardForm.value.creditCard)
            this.activePaymentForm = 'update-card-credit';
          else
            this.activePaymentForm = 'main';

        }

      }),
      tap(creditCards => this.dataSource.data = creditCards.slice(0, this.creditCardsPerPage)),
    );

    this.deliveryOptions$ = this.deliveryOptionService.getDeliveryOptions().pipe(
      tap(deliveryOptions => this.deliveryOptionForm.patchValue({ deliveryOption: deliveryOptions[1] }))
    );

  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  initShippingAddressForms(): void {

    this.mainShippingAddressForm = this.formBuilder.group({
      address: [null, Validators.required]
    });

    this.shippingAddressCtrl = this.formBuilder.control(null, Validators.required);

    this.shippingAddressCtrl.valueChanges.pipe(
      tap(address => { 

        if(!this.mainShippingAddressForm.value.address 
          || (this.mainShippingAddressForm.value.address && this.mainShippingAddressForm.value.address.id !== address.id))
          this.updateAddress(address, 'shipping');
        else
          this.activeShippingAddressForm = 'main';

      }),
      map(() => { return null })
    ).subscribe();

    this.updateShippingAddressForm = this.formBuilder.group({
      address: this.shippingAddressCtrl
    });

  }

  initPaymentForms(): void {

    this.initCreditCardForms();
    this.initBillingAddressForms();
    this.initPromotionForm();

    this.mainPaymentForm = this.formBuilder.group({
      creditCard: this.mainCreditCardForm,
      billingAddress: this.mainBillingAddressForm
    });

  }

  initCreditCardForms(): void {

    this.mainCreditCardForm = this.formBuilder.group({
      creditCard: [null, Validators.required]
    });

    this.updateCreditCardForm = this.formBuilder.group({
      creditCard: [null, Validators.required]
    });

  }

  initBillingAddressForms(): void {

    this.mainBillingAddressForm = this.formBuilder.group({
      address: [null, Validators.required]
    });

    this.billingAddressCtrl = this.formBuilder.control(null, Validators.required);

    this.billingAddressCtrl.valueChanges.pipe(
      tap(address => {

        if(!this.mainBillingAddressForm.value.address 
          || (this.mainBillingAddressForm.value.address && this.mainBillingAddressForm.value.address.id !== address.id))
          this.updateAddress(address, 'billing');
        else
          this.activePaymentForm = 'main';

      }),
      map(() => { return null }) 
    ).subscribe();

    this.updateBillingAddressForm = this.formBuilder.group({
      address: this.billingAddressCtrl
    });

  }

  initPromotionForm(): void {

    this.promotionCtrl = this.formBuilder.control(null);

    this.promotionForm = this.formBuilder.group({
      code: this.promotionCtrl
    });

  }

  initDeliveryOptionForm(): void {

    this.deliveryOptionCtrl = this.formBuilder.control(null, Validators.required);

    this.deliveryOptionCtrl.valueChanges.pipe(
      tap(deliveryOption => this.estimatedDeliveryDate = this.addDaysToDate(new Date(), deliveryOption.time))
    ).subscribe();

    this.deliveryOptionForm = this.formBuilder.group({
      deliveryOption: this.deliveryOptionCtrl
    });

  }

  addDaysToDate(date: Date, days: number): Date {

    date.setDate(date.getDate() + days);

    return date;

  }

  getFormControlErrorText(ctrl: AbstractControl): string {

    if(ctrl.hasError('promotion'))
      return 'Your promotion is invalid';
    else if(ctrl.hasError('required'))
      return 'This field is required';
    else
      return 'This field contains an error';

  }

  getProductsInCart(cart: Cart): number {

    let productsInCart = 0;

    cart.items.forEach(item => productsInCart += item.quantity);

    return productsInCart;

  }

  updateAddress(address: Address, addressType: 'shipping' | 'billing'): void {

    if('shipping' === addressType)
      this.addressService.updateUserDefaultShippingAddress(address);
    else
      this.addressService.updateUserDefaultBillingAddress(address);

  }

  updateCreditCard(creditCard: CreditCard): void {

    this.creditCardService.updateUserDefaultCreditCard(creditCard);

    this.updateCreditCardForm.reset();

  }

  onShowAddressForm(formToShow: 'main' | 'update' | 'add', addressType: 'shipping' | 'billing'): void {

    if('shipping' === addressType) {

      if('main' === formToShow)
        this.activeShippingAddressForm = 'main';
      else
        this.activeShippingAddressForm = `${formToShow}-address-${addressType}`;

    } else {

      if('main' === formToShow)
        this.activePaymentForm = 'main';
      else
        this.activePaymentForm = `${formToShow}-address-${addressType}`;

    }

  }

  onShowPaymentForm(): void {
    this.activePaymentForm = 'main';
  }

  onShowCreditCardForm(formToShow: 'main' | 'update' | 'add'): void {

    if('main' === formToShow)
      this.activePaymentForm = 'main';
    else
      this.activePaymentForm = `${formToShow}-card-credit`;

  }

  onCreditCardChange(creditCard: CreditCard) {

    if(!this.mainCreditCardForm.value.creditCard ||
    (this.mainCreditCardForm.value.creditCard && this.mainCreditCardForm.value.creditCard.id !== creditCard.id))
      this.updateCreditCard(creditCard);
    else {

      this.activePaymentForm = 'main';

      this.updateCreditCardForm.reset();

    }

  }

  onAddPromotion(): void {

    this.promotionService.getPromotionByCode(this.promotionForm.value.code).pipe(
      tap(promotion => this.promotion = promotion),
      tap(promotion => { 
        
        if(!promotion)
          this.promotionCtrl.setErrors({ 'promotion': true });
        
      })
    ).subscribe();

  }

  onOrder(): void {

    this.loading = true;

    this.orderService.addOrder(this.mainShippingAddressForm.value.address, this.mainPaymentForm.value.billingAddress.address,
      this.mainPaymentForm.value.creditCard.creditCard, this.promotionForm.value.code?this.promotion:null, this.deliveryOptionForm.value.deliveryOption,
      this.authService.getUserUsername()).pipe(
      tap(() => this.router.navigateByUrl('/checkout/confirmation')),
      finalize(() => this.loading = false)
    ).subscribe();

  }

  onPageAddresses(event: PageEvent, addresses: Address[]): void {
    this.addressesToShow = addresses.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

  onPageCreditCards(event: PageEvent, creditCards: CreditCard[]): void {
    this.dataSource.data = creditCards.slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize);
  }

}
